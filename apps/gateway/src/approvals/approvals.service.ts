import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../incidents/approval.entity';
import { Artifact } from '../incidents/artifact.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval) private readonly approvalsRepo: Repository<Approval>,
    @InjectRepository(Artifact) private readonly artifactsRepo: Repository<Artifact>,
  ) {}

  async listByArtifact(artifactId: string) {
    return this.approvalsRepo.find({ where: { artifactId }, order: { createdAt: 'DESC' } });
  }

  async requestApproval(artifactId: string, requestedByUserId: string, notes?: string) {
    const artifact = await this.artifactsRepo.findOne({ where: { id: artifactId } });
    if (!artifact) throw new NotFoundException('Artifact not found');

    const approval = this.approvalsRepo.create({
      artifactId,
      requestedByUserId,
      status: 'pending',
      notes: notes || null,
    });
    return this.approvalsRepo.save(approval);
  }

  async act(approvalId: string, action: 'approve' | 'reject', actedByUserId: string, notes?: string) {
    const approval = await this.approvalsRepo.findOne({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException('Approval not found');
    if (approval.status !== 'pending') throw new BadRequestException('Approval not pending');

    approval.status = action === 'approve' ? 'approved' : 'rejected';
    approval.actedByUserId = actedByUserId;
    approval.actedAt = new Date();
    approval.notes = notes || approval.notes;
    return this.approvalsRepo.save(approval);
  }
}
