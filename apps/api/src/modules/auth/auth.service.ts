import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { seconds } from '@nestjs/throttler';
import { UpdateResult } from 'typeorm';
import { UserRole, AuthType } from '../../common/common.enum';
import authConfig from '../../common/configs/auth.config';
import * as cryptoJs from 'crypto-js';
import { UAParser } from 'ua-parser-js';
import {
  APPLICATION_NAME,
  REFRESH_TOKEN_TTL,
  TOKEN_TTL,
} from '../../common/configs/defaultConfig';
import { MessageResponseDto } from '../../common/dto/messageResponse.dto';
import { TokenPayload, UserPayload } from '../../common/type';
import keyLogout from '../../helper/keyLogout';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CacheSignupData, CacheForgotPasswordData } from './auth.interface';
import randomatic from 'randomatic';
import * as requestIp from 'request-ip';
import {
  SignUpDto,
  SignUpVerifyDto,
  LoginResponseDto,
  LoginDto,
  RefreshTokenDto,
  AuthInitDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { Component } from '../../helper/loadTemplate';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * Verifies the sign-up process for a new user.
   *
   * @param {SignUpVerifyDto} dto - The data transfer object containing the email and OTP code.
   * @return {Promise<{message: string}>} - A promise that resolves to an object with a success message.
   * @throws {UnauthorizedException} - If the OTP code is incorrect.
   */
  public async signUpVerify(dto: SignUpVerifyDto): Promise<LoginResponseDto> {
    const { email, otp } = dto;
    const key = `user:signup:${email}`;
    const cacheSignupData = await this.cacheManager.get<CacheSignupData>(key);
    if (!cacheSignupData || cacheSignupData.otp !== otp) {
      throw new UnauthorizedException('OTP code incorrect');
    }
    await this.usersService.createUser({
      email,
      name: email.split('@')[0],
      password: cacheSignupData.password,
      role: UserRole.USER,
    });

    const user = await this.usersService.findOne({
      where: {
        email,
      },
    });

    await this.cacheManager.del(key);
    return this.loginResponse(user, true);
  }

  /**
   * Perform a login operation using the provided LoginDto.
   *
   * @param {LoginDto} dto - the data transfer object containing email and password
   * @return {Promise<any>} the login response
   */
  public async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password, remember } = dto;
    const user = await this.verifyUserPassword(email, password);
    return this.loginResponse(user, remember);
  }

  public async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    try {
      // Verify token
      const payload = this.jwtService.verify<{
        id: string;
        jti: string;
      }>(refreshToken, {
        secret: authConfig.jwtConstants.secretKeyRefreshToken,
      });

      const { id, jti } = payload;
      if (await this.cacheManager.get(keyLogout(jti))) {
        throw new Error('Token is revoked');
      }

      const user = await this.usersService.repo.findOne({
        where: {
          id,
        },
      });

      await this.revokeToken(jti, true);
      return this.loginResponse(user, true);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Verify user password asynchronously.
   *
   * @param {string} email - the user's email
   * @param {string} password - the user's password
   * @return {Promise<User>} the user if the password is valid
   */
  private async verifyUserPassword(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.usersService.repo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    return user;
  }

  /**
   * Generates a login response object based on the user details.
   *
   * @param {User} user - the user object containing email, id, name, and role
   * @return {object} an object containing token, refreshToken, email, id, name, and role
   */
  public async loginResponse(
    user: User,
    remember: boolean
  ): Promise<LoginResponseDto> {
    const { email, id, name, role } = user;
    const jti = nanoid(30);
    const payload: TokenPayload = {
      email,
      id,
      name,
      remember,
      role,
      jti,
    };
    return {
      token: this.jwtService.sign(payload),
      refreshToken: remember
        ? this.jwtService.sign(
            { id, jti },
            {
              expiresIn: REFRESH_TOKEN_TTL,
              secret: authConfig.jwtConstants.secretKeyRefreshToken,
            }
          )
        : null,
    };
  }

  private checkSystemHasAdmin(): Promise<boolean> {
    return this.usersService
      .count({
        where: {
          role: UserRole.ADMIN,
        },
      })
      .then((count) => count > 0);
  }

  /**
   * Initializes the application by creating an admin user if the database is empty.
   *
   * @param {AuthInitDto} dto - the DTO containing the email of the admin user
   * @return {object} an object containing the email and password of the admin user
   */
  public async authInit(
    dto: AuthInitDto
  ): Promise<{ email: string; password: string }> {
    const { email } = dto;

    if (await this.checkSystemHasAdmin()) {
      throw new ForbiddenException('The application is already initialized.');
    }

    const password = nanoid();

    await this.usersService.createUser({
      email,
      name: email.split('@')[0],
      password,
      role: UserRole.ADMIN,
    });
    return {
      email,
      password,
    };
  }

  /**
   * A function to handle Single Sign-On (SSO) for a user based on the given email.
   *`
   * @param {string} email - The email of the user for SSO
   * @return {Promise<any>} The login response after handling SSO
   */
  private async handleSSO(authType: AuthType, email: string, name = null) {
    if (!email) {
      throw new UnauthorizedException('Email is not found');
    }
    let user = await this.usersService.repo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const newUser = new User();
      newUser.name = name ? name : email.split('@')[0];
      newUser.authType = authType;
      newUser.email = email;
      newUser.role = UserRole.USER;
      newUser.password = await this.hashPassword(nanoid());
      user = await this.usersService.repo.save(newUser);
    }
    return this.loginResponse(user, true);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Change the user's password.
   *
   * @param {ChangePasswordDto} dto - The data transfer object containing the old password and the new password.
   * @return {Promise<MessageResponseDto>} - A promise that resolves to a message response indicating the success of the password change.
   */
  public async changePassword(
    dto: ChangePasswordDto,
    user: UserPayload
  ): Promise<MessageResponseDto> {
    const { oldPassword, newPassword } = dto;
    const { email } = user;
    // Check old password
    await this.verifyUserPassword(email, oldPassword);

    // Update new password
    await this.updatePassword(user, newPassword);

    return {
      message: 'Password is updated',
    };
  }

  /**
   * Updates the password for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} newPassword - The new password for the user.
   * @return {Promise<void>} - A promise that resolves when the password is updated successfully.
   */
  private async updatePassword(
    user: UserPayload,
    newPassword: string
  ): Promise<UpdateResult> {
    const passwordHashed = await this.hashPassword(newPassword);
    const result = await this.usersService.repo.update(user.id, {
      password: passwordHashed,
    });

    const parser = new UAParser(user.metadata.userAgent);

    const { name, version } = parser.getBrowser();

    const { name: osName, version: osVersion } = parser.getOS();

    return result;
  }

  /**
   * Handles the forgot password functionality.
   *
   * @param {ForgotPasswordDto} dto - The data transfer object containing the email.
   * @return {Promise<string>} - The OTP code generated for password reset.
   * @throws {ConflictException} - If the request is made within 5 minutes.
   * @throws {NotFoundException} - If the user with the given email is not found.
   */
  public async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;
    const key = `user:forgot-password:${email}`;
    if (await this.cacheManager.get(key)) {
      throw new ConflictException('Please wait for 5 minutes to request again');
    }
    const user = await this.usersService.repo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const otp = randomatic('0', 6);

    const formToken = nanoid(48) + cryptoJs.SHA256(user.id);
    const cacheSignupData: CacheForgotPasswordData = {
      email,
      otp,
      formToken,
    };

    await this.cacheManager.set(key, cacheSignupData, 5 * 60 * 1000);

    return {
      message: 'OTP code sent to your email',
    };
  }

  /**
   * Verifies the OTP code for password reset and generates a form token for the user.
   *
   * @param {ForgotPasswordVerifyDto} dto - The DTO containing the OTP code and email.
   * @return {Promise<{formToken: string}>} - The form token for the user.
   * @throws {UnauthorizedException} - If the OTP code is invalid.
   */
  public async forgotPasswordVerify(dto: ForgotPasswordVerifyDto) {
    const { otp, email } = dto;
    const key = `user:forgot-password:${email}`;

    const cacheForgotPasswordData =
      await this.cacheManager.get<CacheForgotPasswordData>(key);

    if (!cacheForgotPasswordData || cacheForgotPasswordData.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    const { formToken } = cacheForgotPasswordData;

    await this.cacheManager.del(key);

    const user = await this.usersService.repo.findOne({
      where: {
        email,
      },
    });

    await this.cacheManager.set(
      `user:formToken:${formToken}`,
      user.id,
      seconds(3600)
    );
    return {
      formToken: formToken,
    };
  }

  /**
   * Reset the user's password based on the provided form token and new password.
   *
   * @param {ResetPasswordDto} dto - The data transfer object containing form token and new password.
   * @param {Request} req - The request object.
   * @return {Promise<{ message: string }>} A promise that resolves to an object with a success message.
   */
  public async resetPassword(dto: ResetPasswordDto, req: Request) {
    const { formToken, newPassword } = dto;
    const key = `user:formToken:${formToken}`;
    const userId = await this.cacheManager.get<string>(key);

    if (!userId) {
      throw new UnauthorizedException('Invalid form token');
    }

    const user = await this.usersService.repo.findOne({
      where: {
        id: userId,
      },
    });

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      metadata: {
        ipAddress: requestIp.getClientIp(req),
        userAgent: req.headers['user-agent'],
      },
    };

    await this.updatePassword(userPayload, newPassword);

    await this.cacheManager.del(key);

    return this.loginResponse(user, true);
  }

  /**
   * Logs out the user based on the provided request.
   *
   * @param {Request} req - The request object containing the user's token.
   * @return {Object} An object with a message indicating successful logout.
   */
  public async logout(req: Request) {
    const token = req.headers['authorization'];
    const payload: UserPayload = this.jwtService.decode(token);
    const { remember, jti } = payload;
    await this.revokeToken(jti, remember);
    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Revokes a token by setting a logout entry in the cache.
   *
   * @param {string} jti - The unique identifier of the token.
   * @param {boolean} remember - Indicates whether the token should be remembered.
   * @return {Promise<void>} A promise that resolves when the token is revoked.
   */
  public async revokeToken(jti: string, remember: boolean) {
    const ttl = remember ? REFRESH_TOKEN_TTL : TOKEN_TTL;
    return this.cacheManager.set(keyLogout(jti), jti, ttl * 1000);
  }
}
