import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private bookingsService: BookingsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Получаем полную сущность бронирования по ID
    const booking = await this.bookingsService.findOne(
      createPaymentDto.bookingId,
    );
    if (!booking) {
      throw new NotFoundException(
        `Бронирование с ID ${createPaymentDto.bookingId} не найдено`,
      );
    }

    const payment = this.paymentsRepository.create({
      amount: Number(createPaymentDto.amount), // преобразуем в число, если нужно
      method: createPaymentDto.method,
      status: createPaymentDto.status || 'pending',
      booking, // передаём объект Booking
    });
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['booking'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking'],
    });
    if (!payment) {
      throw new NotFoundException(`Платёж с ID ${id} не найден`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    // Обновляем простые поля, если они переданы
    if (updatePaymentDto.amount !== undefined) {
      payment.amount = Number(updatePaymentDto.amount);
    }
    if (updatePaymentDto.method !== undefined) {
      payment.method = updatePaymentDto.method;
    }
    if (updatePaymentDto.status !== undefined) {
      payment.status = updatePaymentDto.status;
    }
    // Если передан bookingId, обновляем связь
    if (updatePaymentDto.bookingId !== undefined) {
      const booking = await this.bookingsService.findOne(
        updatePaymentDto.bookingId,
      );
      if (!booking) {
        throw new NotFoundException(
          `Бронирование с ID ${updatePaymentDto.bookingId} не найдено`,
        );
      }
      payment.booking = booking;
    }

    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Платёж с ID ${id} не найден`);
    }
  }
}
