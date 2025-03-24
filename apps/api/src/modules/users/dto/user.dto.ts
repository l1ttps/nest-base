import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class GetMeResponseDto {
  @ApiPropertyOptional()
  @IsString()
  name: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  // @IsPhoneNumber()
  phoneNumber: string;
}

export class UpdateProfileDto extends GetMeResponseDto {}
