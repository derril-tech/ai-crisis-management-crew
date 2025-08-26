import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from './incident.entity';

@Entity('incident_facts')
export class IncidentFact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incident_id: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  confidence: string;

  @Column({ nullable: true })
  source: string;

  @Column({ default: false })
  is_unknown: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Incident, incident => incident.facts)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;
}
