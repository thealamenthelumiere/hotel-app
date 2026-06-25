import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { paginate, PaginationQuery } from '../common/pagination';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsApiController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех бронирований' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Массив бронирований', type: [Booking] })
  async findAll(
    @Query() query: PaginationQuery,
    @Res({ passthrough: true }) res: Response,
  ) {
    const bookings = await this.bookingsService.findAll();
    return paginate(bookings, query, res, '/api/bookings');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить бронирование по ID' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 200, description: 'Бронирование найдено', type: Booking })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Создать бронирование' })
  @ApiResponse({ status: 201, description: 'Бронирование создано', type: Booking })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или некорректные даты' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Гость или номер не найдены' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Полное обновление бронирования' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 200, description: 'Бронирование обновлено', type: Booking })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Частичное обновление бронирования' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 200, description: 'Бронирование обновлено', type: Booking })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Post(':id/confirm')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Подтвердить бронирование' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 200, description: 'Бронирование подтверждено', type: Booking })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  confirm(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.update(id, { status: 'confirmed' } as UpdateBookingDto);
  }

  @Post(':id/cancel')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Отменить бронирование' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 200, description: 'Бронирование отменено', type: Booking })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.update(id, { status: 'cancelled' } as UpdateBookingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить бронирование (только администратор)' })
  @ApiParam({ name: 'id', description: 'UUID бронирования' })
  @ApiResponse({ status: 204, description: 'Бронирование удалено' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.remove(id);
  }
}
