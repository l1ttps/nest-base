import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'apps/api/src/common/baseEntity.entity';
import { UserRole, AuthType } from 'apps/api/src/common/common.enum';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ enum: UserRole })
  @Column({ enum: UserRole, type: 'enum', default: UserRole.USER })
  role: UserRole;

  @DeleteDateColumn({ nullable: true })
  deleteAt: Date;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.BASIC })
  authType: AuthType;
}
