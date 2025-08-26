import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { Approval } from '../incidents/approval.entity';
import { Artifact } from '../incidents/artifact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approval, Artifact])],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
