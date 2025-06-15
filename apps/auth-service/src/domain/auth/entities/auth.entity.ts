import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CommonEntity } from '@common';

@Entity('auth_accounts')
@Unique(['userId'])
export class AuthEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}