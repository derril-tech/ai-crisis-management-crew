import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from '../incidents/incident.entity';
import { User } from '../users/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incident_id: string;

  @Column()
  title: string;

  @Column({ type: 'uuid', nullable: true })
  owner_id: string;

  @Column({ type: 'timestamp', nullable: true })
  due_at: Date;

  @Column({ type: 'uuid', nullable: true })
  depends_on: string;

  @Column({
    type: 'enum',
    enum: ['todo', 'doing', 'blocked', 'done'],
    default: 'todo',
  })
  status: string;

  @Column({ type: 'int', default: 3 })
  priority: number;

  @Column({ nullable: true })
  channel_hint: string;

  @ManyToOne(() => Incident, incident => incident.tasks)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'depends_on' })
  dependency: Task;
}
