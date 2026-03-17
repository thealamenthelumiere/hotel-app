import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ length: 50 })
  method: string; // cash, card, transfer

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  })
  status: string;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
