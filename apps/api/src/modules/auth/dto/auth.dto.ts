import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_EXAMPLE } from 'apps/api/src/common/configs/defaultConfig';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  email: string;
  @ApiProperty({ required: true, example: PASSWORD_EXAMPLE })
  @IsNotEmpty()
  password: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  @IsOptional()
  remember: boolean;
}

export class LoginResponseDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  token: string;
  @ApiProperty({ required: true })
  @IsOptional()
  refreshToken?: string;
}

export class AuthInitDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}

export class AuthInitResponseDto {
  @ApiProperty({ required: true })
  email: string;
  @ApiProperty({ required: true })
  password: string;
}

export class SSOVerificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  accessToken: string;
}
export class GoogleVerificationDto extends SSOVerificationDto {}
export class FacebookVerificationDto extends SSOVerificationDto {}

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  refreshToken: string;
}

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: PASSWORD_EXAMPLE })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

export class SignUpVerifyDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  otp: string;
}

export class ChangePasswordDto {
  @ApiProperty({ required: true, example: PASSWORD_EXAMPLE })
  @IsString()
  oldPassword: string;

  @ApiProperty({ required: true, example: PASSWORD_EXAMPLE })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}

export class ForgotPasswordVerifyDto extends ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  otp: string;
}

export class ForgotPasswordVerifyResponseDto {
  @ApiProperty({ required: true })
  @IsString()
  formToken: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  formToken: string;

  @ApiProperty({ required: true, example: PASSWORD_EXAMPLE })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  newPassword: string;
}
