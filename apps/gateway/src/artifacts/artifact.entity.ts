import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Incident } from '../incidents/incident.entity';
import { User } from '../users/user.entity';
import { Redline } from './redline.entity';

@Entity('artifacts')
export class Artifact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incident_id: string;

  @Column({
    type: 'enum',
    enum: ['holding', 'press_release', 'internal', 'faq', 'talking_points', 'social_pack', 'status_update'],
  })
  kind: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', nullable: true })
  mdx: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: any;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Incident, incident => incident.artifacts)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Redline, redline => redline.artifact)
  redlines: Redline[];
}
