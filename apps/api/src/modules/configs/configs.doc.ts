import { applyDecorators } from '@nestjs/common';
import { Doc } from '../../common/decorators/doc/doc.decorator';
import { MessageResponseDto } from '../../common/dto/messageResponse.dto';

export function GetGlobalConfigDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Get global config',
      description: 'Get global config',
      response: {
        serialization: MessageResponseDto,
      },
    })
  );
}
