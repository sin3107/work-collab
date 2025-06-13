import { Column, Entity } from 'typeorm';
import { CommonEntity } from '@common';

@Entity('auth')
export class AuthEntity extends CommonEntity {
  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'text' })
  refreshToken: string;
}
