import { CommonEntity } from '@common';
import { Column, Entity } from 'typeorm';

export enum Provider {
    Local = 'Local',
    Naver = 'Naver',
    Kakao = 'Kakao',
    Google = 'Google',
    Apple = 'Apple',
}

export enum UserStatus {
    Active = 'Active',
    Restriction = 'Restriction',
    Withdrawal = 'Withdrawal',
    Suspended = 'Suspended',
}

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  provider: Provider;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Column({ nullable: true })
  fcmToken: string;
}