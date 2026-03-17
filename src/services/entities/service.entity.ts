import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // Название услуги (завтрак, спа, трансфер)

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => Booking, (booking) => booking.services)
  bookings: Booking[];
}
