import { applyDecorators } from '@nestjs/common';
import {
  AuthInitResponseDto,
  ForgotPasswordVerifyResponseDto,
  LoginResponseDto,
} from './dto/auth.dto';
import { Doc } from '../../common/decorators/doc/doc.decorator';
import { MessageResponseDto } from '../../common/dto/messageResponse.dto';
export function LoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with email and password',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}

export function ChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Change password',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}

export function RefreshTokenDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Refresh token',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}

export function LoginGoogleSSODoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with google sso',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}

export function LoginFacebookSSODoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Login with facebook sso',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}

export function InitFirstUser(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Init first user',
      response: {
        serialization: AuthInitResponseDto,
      },
    })
  );
}

export function ForgotPasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Forgot password',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}

export function ForgotPasswordVerifyDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Forgot password verify with otp',
      response: {
        serialization: ForgotPasswordVerifyResponseDto,
      },
    })
  );
}

export function ResetPasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Reset password',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}

export function LogoutDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Logout',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}

export function SignUpDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Sign up a new user',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}

export function SignUpVerifyDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Sign up verify with otp',
      response: {
        serialization: LoginResponseDto,
      },
    })
  );
}
