import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from '../incidents/incident.entity';
import { User } from '../users/user.entity';

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incident_id: string;

  @Column()
  artifact_kind: string;

  @Column({ type: 'int' })
  order_idx: number;

  @Column()
  role_required: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamp', nullable: true })
  acted_at: Date;

  @ManyToOne(() => Incident, incident => incident.approvals)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
