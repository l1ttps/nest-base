import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthInitDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignUpDto,
  SignUpVerifyDto,
} from './dto/auth.dto';
import { Request } from 'express';
import {
  ChangePasswordDoc,
  ForgotPasswordDoc,
  ForgotPasswordVerifyDoc,
  InitFirstUser,
  LoginDoc,
  LogoutDoc,
  RefreshTokenDoc,
  ResetPasswordDoc,
  SignUpDoc,
  SignUpVerifyDoc,
} from './auth.doc';
import { UserPayload } from '../../common/type';
import { AuthGuard, Public } from '../../guards/auth.guard';
import { seconds, Throttle } from '@nestjs/throttler';
import { UserContext } from '../../common/decorators/user-context.decorator';
@ApiTags('authentication')
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @LoginDoc()
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @ApiBearerAuth()
  @ChangePasswordDoc()
  @Post('change-password')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @UserContext() user: UserPayload
  ) {
    return this.authService.changePassword(dto, user);
  }

  @RefreshTokenDoc()
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Public()
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @InitFirstUser()
  @Public()
  @Post('init')
  authInit(@Body() dto: AuthInitDto) {
    return this.authService.authInit(dto);
  }

  @ForgotPasswordDoc()
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ForgotPasswordVerifyDoc()
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Public()
  @Post('forgot-password/verify')
  forgotPasswordVerify(@Body() dto: ForgotPasswordVerifyDto) {
    return this.authService.forgotPasswordVerify(dto);
  }

  @ResetPasswordDoc()
  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    return this.authService.resetPassword(dto, req);
  }

  @LogoutDoc()
  @Post('logout')
  @ApiBearerAuth()
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }
}
