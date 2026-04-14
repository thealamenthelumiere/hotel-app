import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@ApiTags('payments')
@Controller('api/payments')
export class PaymentsApiController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех платежей' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Массив платежей', type: [Payment] })
  async findAll(
    @Query() query: PaginationQuery,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payments = await this.paymentsService.findAll();
    return paginate(payments, query, res, '/api/payments');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить платёж по ID' })
  @ApiParam({ name: 'id', description: 'UUID платежа' })
  @ApiResponse({ status: 200, description: 'Платёж найден', type: Payment })
  @ApiResponse({ status: 404, description: 'Платёж не найден' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать платёж' })
  @ApiResponse({ status: 201, description: 'Платёж создан', type: Payment })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить платёж' })
  @ApiParam({ name: 'id', description: 'UUID платежа' })
  @ApiResponse({ status: 200, description: 'Платёж обновлён', type: Payment })
  @ApiResponse({ status: 404, description: 'Платёж не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить платёж' })
  @ApiParam({ name: 'id', description: 'UUID платежа' })
  @ApiResponse({ status: 204, description: 'Платёж удалён' })
  @ApiResponse({ status: 404, description: 'Платёж не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(id);
  }
}
