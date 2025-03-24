import { Crud } from '@dataui/crud';
import { Controller, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { crudConfig } from '../configs/crud.config';
import { ControllerCrudOptions } from '../type';

export function ControllerCrud<T>(
  options: ControllerCrudOptions
): ClassDecorator {
  const { entity, name, crud } = options;

  // Assuming query is defined in your crudConfig
  const query = crudConfig ? crudConfig.query : {};

  const decorators = [
    Crud({
      model: {
        type: entity,
      },
      query,
      params: {
        id: {
          type: 'uuid',
          primary: true,
          field: 'id',
        },
      },
      ...crud,
    }),
    ApiTags(name),
    Controller(name),
    ApiConsumes('application/json'),
    ApiBearerAuth(),
  ];
  return applyDecorators(...decorators);
}
