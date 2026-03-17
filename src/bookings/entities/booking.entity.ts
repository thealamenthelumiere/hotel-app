import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Guest } from '../../guests/entities/guest.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Guest, (guest) => guest.bookings)
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true })
  payment: Payment;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'booking_services',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];
}
