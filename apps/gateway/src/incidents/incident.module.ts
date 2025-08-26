import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { Incident } from './incident.entity';
import { IncidentFact } from './incident-fact.entity';
import { Artifact } from './artifact.entity';
import { Task } from './task.entity';
import { Approval } from './approval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incident,
      IncidentFact,
      Artifact,
      Task,
      Approval,
    ]),
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
