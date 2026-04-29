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
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@ApiTags('guests')
@Controller('api/guests')
export class GuestsApiController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех гостей' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Массив гостей', type: [Guest] })
  async findAll(
    @Query() query: PaginationQuery,
    @Res({ passthrough: true }) res: Response,
  ) {
    const guests = await this.guestsService.findAll();
    return paginate(guests, query, res, '/api/guests');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить гостя по ID' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 200, description: 'Гость найден', type: Guest })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.guestsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать профиль гостя' })
  @ApiResponse({ status: 201, description: 'Гость создан', type: Guest })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные гостя' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 200, description: 'Гость обновлён', type: Guest })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить гостя' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 204, description: 'Гость удалён' })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.guestsService.remove(id);
  }
}
