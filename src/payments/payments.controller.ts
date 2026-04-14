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
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

function sessionLocals(req: Request) {
  const session = req.session as { userId?: string; userRole?: string; userName?: string };
  return {
    isAuthenticated: !!session.userId,
    isAdmin: session.userRole === UserRole.ADMIN,
    user: session.userName || null,
  };
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('payments/index')
  async index(@Req() req: Request) {
    const payments = await this.paymentsService.findAll();
    return { payments, ...sessionLocals(req) };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('payments/add')
  async addForm(@Req() req: Request) {
    const bookings = await this.bookingsService.findAllWithoutPayment();
    return { bookings, ...sessionLocals(req) };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/payments')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    await this.paymentsService.create(createPaymentDto);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('payments/show')
  async show(@Param('id') id: string, @Req() req: Request) {
    const payment = await this.paymentsService.findOne(id);
    return { payment, ...sessionLocals(req) };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('payments/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const payment = await this.paymentsService.findOne(id);
    const bookings = await this.bookingsService.findAllWithoutPayment();
    return { payment, bookings, ...sessionLocals(req) };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/payments')
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    await this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/payments')
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
  }
}
