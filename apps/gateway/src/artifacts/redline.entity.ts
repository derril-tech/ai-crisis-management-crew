import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Artifact } from './artifact.entity';

@Entity('redlines')
export class Redline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  artifact_id: string;

  @Column()
  agent: string;

  @Column({ type: 'int' })
  start_pos: number;

  @Column({ type: 'int' })
  end_pos: number;

  @Column({ type: 'text' })
  suggestion: string;

  @Column()
  risk_tag: string;

  @Column({ default: false })
  applied: boolean;

  @ManyToOne(() => Artifact, artifact => artifact.redlines)
  @JoinColumn({ name: 'artifact_id' })
  artifact: Artifact;
}
