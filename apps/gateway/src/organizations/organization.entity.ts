import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Membership } from '../memberships/membership.entity';

@Entity('orgs')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'free' })
  plan: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToMany(() => Membership, membership => membership.organization)
  memberships: Membership[];
}
