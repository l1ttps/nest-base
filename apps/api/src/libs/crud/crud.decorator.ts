import { applyDecorators, Type } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CrudOptions } from './crud.interface';

export function Crud<T>(options: CrudOptions<T>) {
  return function <T extends Type<any>>(Base: T): T {
    class CrudController extends Base {
      constructor(...args: any[]) {
        super(...args);
      }

      @Get()
      findAll() {
        return this.service.getManyBase();
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.service.getOneBase(id);
      }

      @Post()
      create(@Body() dto: any) {
        return this.service.createOneBase(dto);
      }

      @Patch(':id')
      update(@Param('id') id: string, @Body() dto: any) {
        return this.service.updateOneBase(id, dto);
      }

      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.service.deleteOneBase(id);
      }
    }

    applyDecorators(ApiTags(options.model.name))(CrudController);
    return CrudController;
  };
}
