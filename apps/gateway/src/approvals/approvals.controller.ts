import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { AuthGuard } from '@nestjs/passport';

class RequestApprovalDto { notes?: string }
class ActApprovalDto { action: 'approve' | 'reject'; notes?: string }

@UseGuards(AuthGuard('jwt'))
@Controller('v1/approvals')
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  @Get('artifact/:artifactId')
  async list(@Param('artifactId') artifactId: string) {
    return this.approvals.listByArtifact(artifactId);
  }

  @Post('artifact/:artifactId/request')
  async request(@Param('artifactId') artifactId: string, @Req() req: any, @Body() body: RequestApprovalDto) {
    return this.approvals.requestApproval(artifactId, req.user.sub, body.notes);
  }

  @Post(':approvalId/act')
  async act(@Param('approvalId') approvalId: string, @Req() req: any, @Body() body: ActApprovalDto) {
    return this.approvals.act(approvalId, body.action, req.user.sub, body.notes);
  }
}
