import { Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { CommonEntity } from '@common';
import { TeamEntity } from './team.entity';

@Entity('team_invite_tokens')
@Unique(['token'])
export class TeamInviteTokenEntity extends CommonEntity {
  @Column()
  token: string;

  @Column()
  teamId: number;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @Column()
  createdBy: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}
