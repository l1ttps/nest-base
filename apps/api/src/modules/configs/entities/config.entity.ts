import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'apps/api/src/common/baseEntity.entity';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity('configs')
export class Config extends BaseEntity {
  @ApiProperty({
    title: 'Is Boolean Field',
    description: 'Is Boolean Field',
  })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  isBooleanField: boolean;

  @ApiProperty({
    title: 'This is a string field',
    description: 'This is string field',
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  stringField: string;
}
