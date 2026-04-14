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

type SessionData = {
  userId?: string;
  userRole?: string;
  userName?: string;
  userEmail?: string;
};

function sessionLocals(req: Request) {
  const s = req.session as SessionData;
  return {
    isAuthenticated: !!s.userId,
    isAdmin: s.userRole === UserRole.ADMIN,
    user: s.userName || null,
  };
}

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
    return { bookings, ...sessionLocals(req) };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUEST)
  @Render('bookings/add')
  async addForm(@Req() req: Request) {
    const s = req.session as SessionData;
    const isAdmin = s.userRole === UserRole.ADMIN;
    const [rooms, services] = await Promise.all([
      this.roomsService.findAll(),
      this.servicesService.findAll(),
    ]);

    if (isAdmin) {
      const guests = await this.guestsService.findAll();
      return { guests, currentGuest: null, rooms, services, ...sessionLocals(req) };
    }

    // Для гостя — найти или создать профиль гостя по userId
    const currentGuest = await this.guestsService.findOrCreateByUser(
      s.userId!,
      s.userName || 'Гость',
      s.userEmail || '',
    );
    return { guests: [], currentGuest, rooms, services, ...sessionLocals(req) };
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
    return { booking, ...sessionLocals(req) };
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
    return { booking, guests, rooms, services, ...sessionLocals(req) };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUEST)
  @Redirect('/bookings')
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    const s = req.session as SessionData;
    if (s.userRole !== UserRole.ADMIN) {
      // Гость всегда бронирует от своего профиля со статусом pending
      const guest = await this.guestsService.findByUserId(s.userId!);
      if (guest) createBookingDto.guestId = guest.id;
      createBookingDto.status = 'pending';
    }
    await this.bookingsService.create(createBookingDto);
  }

  @Post(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/bookings')
  async confirm(@Param('id') id: string) {
    await this.bookingsService.update(id, { status: 'confirmed' } as UpdateBookingDto);
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
