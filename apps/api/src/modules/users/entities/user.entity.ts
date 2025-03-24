import { BaseEntity } from 'apps/api/src/common/baseEntity.entity';
import { Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {}
