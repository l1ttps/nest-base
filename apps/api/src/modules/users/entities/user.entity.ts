import { AuthType, UserRole } from 'apps/api/common/common.enum';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/baseEntity.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ enum: UserRole, type: 'enum', default: UserRole.USER })
  role: UserRole;

  @DeleteDateColumn({ nullable: true })
  deleteAt: Date;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.BASIC })
  authType: AuthType;
}
