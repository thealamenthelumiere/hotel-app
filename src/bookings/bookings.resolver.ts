import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { GuestsService } from '../guests/guests.service';
import { RoomsService } from '../rooms/rooms.service';
import { ServicesService } from '../services/services.service';
import { BookingType, BookingPage } from './graphql/booking.type';
import { GuestType } from '../guests/graphql/guest.type';
import { RoomType } from '../rooms/graphql/room.type';
import { ServiceType } from '../services/graphql/service.type';
import { CreateBookingInput, UpdateBookingInput } from './graphql/booking.input';
import { Booking } from './entities/booking.entity';

@Resolver(() => BookingType)
export class BookingsResolver {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly guestsService: GuestsService,
    private readonly roomsService: RoomsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Query(() => BookingPage, {
    name: 'bookings',
    description: 'Получить список бронирований с пагинацией',
    complexity: 3,
  })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1, description: 'Номер страницы' }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10, description: 'Записей на странице' }) limit: number,
  ): Promise<BookingPage> {
    const all = await this.bookingsService.findAll();
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const data = all.slice((page - 1) * limit, page * limit);
    return { data: data as any, total, page, limit, totalPages };
  }

  @Query(() => BookingType, {
    name: 'booking',
    description: 'Получить бронирование по ID',
    complexity: 2,
  })
  findOne(@Args('id', { type: () => ID, description: 'UUID бронирования' }) id: string) {
    return this.bookingsService.findOne(id);
  }

  // ─── Field resolvers (lazy-load связанных сущностей) ─────────────────────

  @ResolveField(() => GuestType, { nullable: true, description: 'Гость бронирования', complexity: 2 })
  async guest(@Parent() booking: Booking): Promise<GuestType | null> {
    if (booking.guest) return booking.guest as any;
    const full = await this.bookingsService.findOne(booking.id);
    return full.guest as any;
  }

  @ResolveField(() => RoomType, { nullable: true, description: 'Номер бронирования', complexity: 2 })
  async room(@Parent() booking: Booking): Promise<RoomType | null> {
    if (booking.room) return booking.room as any;
    const full = await this.bookingsService.findOne(booking.id);
    return full.room as any;
  }

  @ResolveField(() => [ServiceType], { nullable: true, description: 'Доп. услуги', complexity: 3 })
  async services(@Parent() booking: Booking): Promise<ServiceType[]> {
    if (booking.services) return booking.services as any;
    const full = await this.bookingsService.findOne(booking.id);
    return (full.services ?? []) as any;
  }

  // ─── Mutations ────────────────────────────────────────────────────────────

  @Mutation(() => BookingType, { description: 'Создать бронирование' })
  createBooking(@Args('input') input: CreateBookingInput) {
    return this.bookingsService.create(input as any);
  }

  @Mutation(() => BookingType, { description: 'Обновить бронирование' })
  updateBooking(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBookingInput,
  ) {
    return this.bookingsService.update(id, input as any);
  }

  @Mutation(() => BookingType, {
    description: 'Подтвердить бронирование (перевести в статус confirmed)',
  })
  confirmBooking(@Args('id', { type: () => ID, description: 'UUID бронирования' }) id: string) {
    return this.bookingsService.update(id, { status: 'confirmed' } as any);
  }

  @Mutation(() => BookingType, {
    description: 'Отменить бронирование (перевести в статус cancelled)',
  })
  cancelBooking(@Args('id', { type: () => ID, description: 'UUID бронирования' }) id: string) {
    return this.bookingsService.update(id, { status: 'cancelled' } as any);
  }

  @Mutation(() => Boolean, { description: 'Удалить бронирование' })
  async deleteBooking(@Args('id', { type: () => ID }) id: string) {
    await this.bookingsService.remove(id);
    return true;
  }
}
