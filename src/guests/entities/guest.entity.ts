import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @OneToMany(() => Booking, (booking) => booking.guest)
  bookings: Booking[];
}
