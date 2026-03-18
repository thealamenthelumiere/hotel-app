import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GuestsService } from '../guests/guests.service';
import { RoomsService } from '../rooms/rooms.service';
import { ServicesService } from '../services/services.service';
import { Service } from '../services/entities/service.entity';
import { Subject } from 'rxjs';

@Injectable()
export class BookingsService {
  private bookingCreatedSource = new Subject<Booking>();
  bookingCreated$ = this.bookingCreatedSource.asObservable();

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private guestsService: GuestsService,
    private roomsService: RoomsService,
    private servicesService: ServicesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // 1. Получаем связанные сущности
    const guest = await this.guestsService.findOne(createBookingDto.guestId);
    const room = await this.roomsService.findOne(createBookingDto.roomId);

    // 2. Рассчитываем количество ночей
    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (nights <= 0) {
      throw new BadRequestException(
        'Дата выезда должна быть позже даты заезда',
      );
    }

    // 3. Базовая цена номера
    let totalPrice = room.pricePerNight * nights;

    // 4. Добавляем услуги, если выбраны (исправленная типизация)
    let services: Service[] = [];
    if (createBookingDto.serviceIds && createBookingDto.serviceIds.length) {
      services = await this.servicesService.findByIds(
        createBookingDto.serviceIds,
      );
      totalPrice += services.reduce((sum, s) => sum + s.price, 0);
    }

    // 5. Создаём бронирование
    const booking = this.bookingsRepository.create({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: createBookingDto.status || 'pending',
      guest,
      room,
      services,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    // 6. Отправляем событие SSE
    this.bookingCreatedSource.next(savedBooking);

    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['guest', 'room', 'services', 'payment'],
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['guest', 'room', 'services', 'payment'],
    });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (updateBookingDto.guestId) {
      booking.guest = await this.guestsService.findOne(
        updateBookingDto.guestId,
      );
    }
    if (updateBookingDto.roomId) {
      booking.room = await this.roomsService.findOne(updateBookingDto.roomId);
    }
    if (updateBookingDto.checkInDate) {
      booking.checkInDate = new Date(updateBookingDto.checkInDate);
    }
    if (updateBookingDto.checkOutDate) {
      booking.checkOutDate = new Date(updateBookingDto.checkOutDate);
    }
    if (updateBookingDto.status) {
      booking.status = updateBookingDto.status;
    }
    if (updateBookingDto.serviceIds) {
      booking.services = await this.servicesService.findByIds(
        updateBookingDto.serviceIds,
      );
    }

    // Пересчёт цены
    const nights = Math.ceil(
      (booking.checkOutDate.getTime() - booking.checkInDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    let totalPrice = booking.room.pricePerNight * nights;
    if (booking.services && booking.services.length) {
      totalPrice += booking.services.reduce((sum, s) => sum + s.price, 0);
    }
    booking.totalPrice = totalPrice;

    return this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }
  }

  // Вспомогательный метод для получения бронирований без платежа (исправлено)
  async findAllWithoutPayment(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { payment: IsNull() }, // используем IsNull() вместо null
      relations: ['guest', 'room'],
    });
  }
}
