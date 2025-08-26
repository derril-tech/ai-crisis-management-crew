import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@ApiTags('Incidents')
@Controller('incidents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  create(@Body() createIncidentDto: CreateIncidentDto, @Request() req) {
    return this.incidentsService.create(createIncidentDto, req.user.id, req.user.org_id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incidents for organization' })
  @ApiResponse({ status: 200, description: 'Incidents retrieved successfully' })
  findAll(@Request() req) {
    return this.incidentsService.findAll(req.user.org_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Incident retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.incidentsService.findOne(id, req.user.org_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident' })
  @ApiResponse({ status: 200, description: 'Incident updated successfully' })
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto, @Request() req) {
    return this.incidentsService.update(id, updateIncidentDto, req.user.org_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident' })
  @ApiResponse({ status: 200, description: 'Incident deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.incidentsService.remove(id, req.user.org_id);
  }

  @Post(':id/facts')
  @ApiOperation({ summary: 'Add fact to incident' })
  @ApiResponse({ status: 201, description: 'Fact added successfully' })
  addFact(@Param('id') id: string, @Body() factData: any, @Request() req) {
    return this.incidentsService.addFact(id, factData, req.user.org_id);
  }
}
