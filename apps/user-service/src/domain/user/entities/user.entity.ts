import { CommonEntity, Provider, UserRole, UserStatus } from '@common';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  provider: Provider;

  @Column({ nullable: true })
  providerId: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
}