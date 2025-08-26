import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Organization } from '../organizations/organization.entity';
import { Membership } from '../memberships/membership.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  org_id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  role: string;

  @Column({ default: 'UTC' })
  tz: string;

  @Exclude()
  @Column({ nullable: true })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Organization, org => org.users)
  organization: Organization;

  @OneToMany(() => Membership, membership => membership.user)
  memberships: Membership[];
}
