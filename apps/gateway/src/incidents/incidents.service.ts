import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Incident } from './incident.entity';
import { IncidentFact } from './incident-fact.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
    @InjectRepository(IncidentFact)
    private incidentFactsRepository: Repository<IncidentFact>,
  ) {}

  async create(createIncidentDto: CreateIncidentDto, userId: string, orgId: string): Promise<Incident> {
    const incident = this.incidentsRepository.create({
      ...createIncidentDto,
      created_by: userId,
      org_id: orgId,
    });

    return this.incidentsRepository.save(incident);
  }

  async findAll(orgId: string): Promise<Incident[]> {
    return this.incidentsRepository.find({
      where: { org_id: orgId },
      relations: ['facts', 'artifacts', 'tasks'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, orgId: string): Promise<Incident> {
    const incident = await this.incidentsRepository.findOne({
      where: { id, org_id: orgId },
      relations: ['facts', 'artifacts', 'tasks', 'approvals', 'creator'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto, orgId: string): Promise<Incident> {
    const incident = await this.findOne(id, orgId);
    
    Object.assign(incident, updateIncidentDto);
    return this.incidentsRepository.save(incident);
  }

  async remove(id: string, orgId: string): Promise<void> {
    const incident = await this.findOne(id, orgId);
    await this.incidentsRepository.remove(incident);
  }

  async addFact(incidentId: string, factData: any, orgId: string): Promise<IncidentFact> {
    await this.findOne(incidentId, orgId); // Verify incident exists and belongs to org

    const fact = this.incidentFactsRepository.create({
      ...factData,
      incident_id: incidentId,
    });

    return this.incidentFactsRepository.save(fact);
  }
}
