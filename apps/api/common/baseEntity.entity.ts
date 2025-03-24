import { PrimaryColumn, Generated, Column, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
