import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';
import { IncidentFact } from './incident-fact.entity';
import { Artifact } from './artifact.entity';
import { Task } from './task.entity';
import { Approval } from './approval.entity';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  org_id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high',
  })
  severity: string;

  @Column({
    type: 'enum',
    enum: ['created', 'triage', 'drafting', 'legal_review', 'approvals', 'ready', 'published', 'monitoring', 'resolved', 'exported', 'archived'],
    default: 'created',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  detected_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => IncidentFact, fact => fact.incident)
  facts: IncidentFact[];

  @OneToMany(() => Artifact, artifact => artifact.incident)
  artifacts: Artifact[];

  @OneToMany(() => Task, task => task.incident)
  tasks: Task[];

  @OneToMany(() => Approval, approval => approval.incident)
  approvals: Approval[];
}
