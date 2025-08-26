import { Controller, Get, Query } from '@nestjs/common';

@Controller('v1/monitor')
export class MonitorController {
  @Get('mentions')
  async mentions(@Query('incidentId') incidentId: string) {
    return { mentions: [{ id: 'm-1', incident_id: incidentId, source: 'social', text: 'Hearing about a breach', created_at: new Date().toISOString(), sentiment: -0.2 }] };
  }

  @Get('rumors')
  async rumors(@Query('incidentId') incidentId: string) {
    return { rumors: [{ id: 'r-1', incident_id: incidentId, text: 'Payment data leaked?', confidence: 0.6, severity: 'medium', created_at: new Date().toISOString() }] };
  }

  @Get('sentiment')
  async sentiment(@Query('incidentId') incidentId: string) {
    const now = Date.now();
    const series = Array.from({ length: 24 }).map((_, i) => ({ t: new Date(now - (24 - i) * 3600000).toISOString(), value: Math.sin(i / 3) * 0.3 }));
    return { series };
  }
}
