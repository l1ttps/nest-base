import { JwtPayload as JwtPayloadBase } from "jsonwebtoken";
import { ForgotPasswordDto, SignUpDto } from "./dto/auth.dto";

export interface JwtPayload extends JwtPayloadBase {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CacheSignupData extends SignUpDto {
  otp: string;
}

export interface CacheForgotPasswordData extends ForgotPasswordDto {
  otp: string;
  formToken: string;
}
