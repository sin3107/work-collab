import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorModule } from '@error';
import { TeamEntity } from './entities/team.entity';
import { TeamInviteTokenEntity } from './entities/team-invite-token.entity';
import { UserTeamEntity } from './entities/user-team.entity';
import { TeamRepository } from './team.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamEntity, 
      UserTeamEntity, 
      TeamInviteTokenEntity
    ]),
    ErrorModule
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
  exports: [TeamService]
})
export class TeamModule { }
