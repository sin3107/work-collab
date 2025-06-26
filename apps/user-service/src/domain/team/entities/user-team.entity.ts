import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { CommonEntity, TeamRole } from '@common';
import { TeamEntity } from './team.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('user_teams')
export class UserTeamEntity extends CommonEntity {
  @Column()
  teamId: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: TeamRole, default: TeamRole.Member })
  role: TeamRole;

  @Column({ nullable: true })
  invitedBy?: number;

  @ManyToOne(() => TeamEntity, team => team.members, { onDelete: 'CASCADE' })
  team: TeamEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;
}