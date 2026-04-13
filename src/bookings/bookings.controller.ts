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
  UseGuards,
  Req,
  Sse,
} from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs/operators';
import { BookingsService } from './bookings.service';
import { GuestsService } from '../guests/guests.service';
import { RoomsService } from '../rooms/rooms.service';
import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly guestsService: GuestsService,
    private readonly roomsService: RoomsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  @Render('bookings/index')
  async index(@Req() req: Request) {
    const bookings = await this.bookingsService.findAll();
    const session = req.session as { userId?: string; userRole?: string; userName?: string };
    return {
      bookings,
      isAuthenticated: !!session.userId,
      isAdmin: session.userRole === UserRole.ADMIN,
      user: session.userName || null,
    };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUEST)
  @Render('bookings/add')
  async addForm(@Req() req: Request) {
    const [guests, rooms, services] = await Promise.all([
      this.guestsService.findAll(),
      this.roomsService.findAll(),
      this.servicesService.findAll(),
    ]);
    const session = req.session as { userId?: string; userRole?: string; userName?: string };
    return {
      guests,
      rooms,
      services,
      isAuthenticated: !!session.userId,
      isAdmin: session.userRole === UserRole.ADMIN,
      user: session.userName || null,
    };
  }

  // SSE — должен быть до маршрутов с параметрами
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

  @Get(':id')
  @Render('bookings/show')
  async show(@Param('id') id: string, @Req() req: Request) {
    const booking = await this.bookingsService.findOne(id);
    const session = req.session as { userId?: string; userRole?: string; userName?: string };
    return {
      booking,
      isAuthenticated: !!session.userId,
      isAdmin: session.userRole === UserRole.ADMIN,
      user: session.userName || null,
    };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('bookings/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const [booking, guests, rooms, services] = await Promise.all([
      this.bookingsService.findOne(id),
      this.guestsService.findAll(),
      this.roomsService.findAll(),
      this.servicesService.findAll(),
    ]);
    const session = req.session as { userId?: string; userRole?: string; userName?: string };
    return {
      booking,
      guests,
      rooms,
      services,
      isAuthenticated: !!session.userId,
      isAdmin: session.userRole === UserRole.ADMIN,
      user: session.userName || null,
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUEST)
  @Redirect('/bookings')
  async create(@Body() createBookingDto: CreateBookingDto) {
    await this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/bookings')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    await this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/bookings')
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(id);
  }
}
