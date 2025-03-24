import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MessageResponseDto } from '../../common/dto/messageResponse.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetMeResponseDto, UpdateProfileDto } from './dto/user.dto';
import { UserPayload } from '../../common/type';
@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
    super(repo);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /**
   * Create a new user in the database.
   *
   * @param {CreateUserDto} dto - the data transfer object containing email, name and password
   * @return {Promise<CreateUserDto>} the data transfer object that was passed in
   * @throws {ConflictException} if the email is already in use
   */
  public async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    const { email, password, name, role } = dto;
    const newUser = new User();
    newUser.email = email;
    const salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(password, salt);
    newUser.name = name;
    newUser.role = role;

    const check = await this.repo.count({
      where: {
        email,
      },
    });
    if (check > 0) {
      throw new ConflictException('Email is already in use');
    }
    await this.repo.save(newUser);
    return dto;
  }

  /**
   * Retrieves the user information based on the provided currentUser.
   *
   * @param {UserPayload} currentUser - The current user object containing the user's ID.
   * @return {Promise<GetMeResponseDto>} A promise that resolves to the user's name and phone number.
   */
  public async getMe(currentUser: UserPayload): Promise<GetMeResponseDto> {
    const { id } = currentUser;

    const user = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { name, phoneNumber } = user;
    return {
      name,
      phoneNumber,
    };
  }

  /**
   * Updates the user profile with the provided information.
   *
   * @param {UserPayload} user - The user payload object containing user information.
   * @param {UpdateProfileDto} dto - The data transfer object containing updated profile information.
   * @return {Promise<MessageResponseDto>} A promise that resolves to a message response indicating the success of the profile update.
   */
  public async updateProfile(
    user: UserPayload,
    dto: UpdateProfileDto
  ): Promise<MessageResponseDto> {
    await this.repo.update(user.id, dto);

    return {
      message: 'Profile updated successfully',
    };
  }
}
