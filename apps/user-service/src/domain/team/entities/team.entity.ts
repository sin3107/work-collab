import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity, TeamVisibility } from '@common';
import { UserTeamEntity } from './user-team.entity';

@Entity('teams')
export class TeamEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'enum', enum: TeamVisibility, default: TeamVisibility.Private })
  visibility: TeamVisibility;

  @Column()
  createdBy: number;

  @OneToMany(() => UserTeamEntity, userTeam => userTeam.team)
  members: UserTeamEntity[];
}
