import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsApiController } from './bookings.api.controller';
import { Booking } from './entities/booking.entity';
import { GuestsModule } from '../guests/guests.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    GuestsModule,
    RoomsModule,
    ServicesModule,
  ],
  controllers: [BookingsController, BookingsApiController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
