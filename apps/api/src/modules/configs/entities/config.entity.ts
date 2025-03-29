import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'apps/api/src/common/baseEntity.entity';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class ConfigEntity extends BaseEntity {
  @ApiProperty({
    title: 'Is Boolean Field',
    description: 'Is Boolean Field',
  })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  isBooleanField: boolean;
}
