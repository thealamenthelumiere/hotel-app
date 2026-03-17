import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  number: string; // Номер комнаты (например, "101")

  @Column({ length: 50 })
  type: string; // Тип номера: стандарт, люкс, полулюкс и т.д.

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column()
  capacity: number; // Максимальное количество гостей

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
