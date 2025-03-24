import { Type } from '@nestjs/common';

export interface CrudOptions<T> {
  model: Type<T>;
}
