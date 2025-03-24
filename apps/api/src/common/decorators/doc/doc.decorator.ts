import { applyDecorators, HttpStatus, SetMetadata } from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { IDocOptions, IDocResponseOptions } from './doc.interface';
import { AppResponseSerialization } from './response.serialization';

export const RESPONSE_DOCS_METADATA = 'RESPONSE_DOCS_METADATA';
export function Doc<T>(options?: IDocOptions<T>): MethodDecorator {
  const docs = [];

  if (options?.request?.bodyType === 'FORM_DATA') {
    docs.push(ApiConsumes('multipart/form-data'));
  } else docs.push(ApiConsumes('application/json'));

  docs.push(ApiProduces('application/json'));
  docs.push(DocDefault(options?.response || {}));

  if (options?.request?.params) {
    docs.push(
      ...(options?.request?.params || []).map((param) => ApiParam(param))
    );
  }

  if (options?.request?.queries) {
    docs.push(
      ...(options?.request?.queries || []).map((query) => ApiQuery(query))
    );
  }

  if (options?.description || options?.summary) {
    docs.push(
      ApiOperation({
        description: options?.description,
        summary: options.summary,
      })
    );
  }

  docs.push(SetMetadata(RESPONSE_DOCS_METADATA, true));

  return applyDecorators(...docs);
}

export function DocDefault<T>({
  dataSchema,
  description,
  extraModels = [],
  httpStatus: status = HttpStatus.OK,
  messageExample,
  serialization,
}: IDocResponseOptions): MethodDecorator {
  const docs = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(AppResponseSerialization<T>) }],
    properties: {},
  };

  if (dataSchema) {
    schema.properties.data = dataSchema;
  } else if (serialization) {
    docs.push(ApiExtraModels(serialization));
    schema.properties.data = { $ref: getSchemaPath(serialization) };
  }
  extraModels?.map((model) => docs.push(ApiExtraModels(model)));

  return applyDecorators(
    ApiExtraModels(AppResponseSerialization<T>),
    ApiResponse({ description, status, schema }),
    ...docs
  );
}
