import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Guest } from '../../guests/entities/guest.entity';

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Guest, (guest) => guest.user)
  guest: Guest;
}
