import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

@Entity('memberships')
export class Membership {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  org_id: string;

  @Column({
    type: 'enum',
    enum: ['owner', 'admin', 'pr', 'legal', 'social', 'exec', 'viewer'],
  })
  workspace_role: string;

  @ManyToOne(() => User, user => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, org => org.memberships)
  @JoinColumn({ name: 'org_id' })
  organization: Organization;
}
