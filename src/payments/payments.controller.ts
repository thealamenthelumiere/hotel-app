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
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly bookingsService: BookingsService, // для формы добавления
  ) {}

  @Get()
  @Render('payments/index')
  async index() {
    const payments = await this.paymentsService.findAll();
    return { payments };
  }

  @Get('add')
  @Render('payments/add')
  async addForm() {
    const bookings = await this.bookingsService.findAllWithoutPayment(); // только без платежа
    return { bookings };
  }

  @Post()
  @Redirect('/payments')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    await this.paymentsService.create(createPaymentDto);
  }

  @Get(':id')
  @Render('payments/show')
  async show(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    return { payment };
  }

  @Get(':id/edit')
  @Render('payments/edit')
  async editForm(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    const bookings = await this.bookingsService.findAllWithoutPayment();
    return { payment, bookings };
  }

  @Put(':id')
  @Redirect('/payments')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    await this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Redirect('/payments')
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
  }
}
