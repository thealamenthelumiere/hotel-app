import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Render,
  Redirect,
  Query,
  Sse,
} from '@nestjs/common';
//import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingsService } from './bookings.service';
import { GuestsService } from '../guests/guests.service';
import { RoomsService } from '../rooms/rooms.service';
import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly guestsService: GuestsService,
    private readonly roomsService: RoomsService,
    private readonly servicesService: ServicesService,
  ) {}

  // Статические маршруты – без параметров
  @Get()
  @Render('bookings/index')
  async index(@Query('auth') auth: string) {
    const bookings = await this.bookingsService.findAll();
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return { bookings, isAuthenticated, user };
  }

  @Get('add')
  @Render('bookings/add')
  async addForm(@Query('auth') auth: string) {
    const [guests, rooms, services] = await Promise.all([
      this.guestsService.findAll(),
      this.roomsService.findAll(),
      this.servicesService.findAll(),
    ]);
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return { guests, rooms, services, isAuthenticated, user };
  }

  // SSE должен быть до динамических маршрутов с параметрами
  @Sse('sse')
  sse() {
    return this.bookingsService.bookingCreated$.pipe(
      map((booking) => ({
        data: {
          message: `Новое бронирование: ${booking.guest?.name} в номер ${booking.room?.number}`,
          booking,
        },
      })),
    );
  }

  // Динамические маршруты
  @Get(':id')
  @Render('bookings/show')
  async show(@Param('id') id: string, @Query('auth') auth: string) {
    const booking = await this.bookingsService.findOne(id);
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return { booking, isAuthenticated, user };
  }

  @Get(':id/edit')
  @Render('bookings/edit')
  async editForm(@Param('id') id: string, @Query('auth') auth: string) {
    const [booking, guests, rooms, services] = await Promise.all([
      this.bookingsService.findOne(id),
      this.guestsService.findAll(),
      this.roomsService.findAll(),
      this.servicesService.findAll(),
    ]);
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return { booking, guests, rooms, services, isAuthenticated, user };
  }

  @Post()
  @Redirect('/bookings')
  async create(@Body() createBookingDto: CreateBookingDto) {
    await this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @Redirect('/bookings')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    await this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @Redirect('/bookings')
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(id);
  }
}
