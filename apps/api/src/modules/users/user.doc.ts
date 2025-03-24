import { applyDecorators } from '@nestjs/common';
import { MessageResponseDto } from '../../common/dto/messageResponse.dto';
import { Doc } from '../../common/decorators/doc/doc.decorator';
import { GetMeResponseDto } from './dto/user.dto';
export function GetMeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Get my profile',
      response: {
        serialization: GetMeResponseDto,
      },
    })
  );
}

export function UpdateProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Update my profile',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}
