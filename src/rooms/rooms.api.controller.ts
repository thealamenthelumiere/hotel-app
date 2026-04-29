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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@ApiTags('rooms')
@Controller('api/rooms')
export class RoomsApiController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех номеров' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Массив номеров', type: [Room] })
  @ApiResponse({ status: 400, description: 'Некорректные параметры пагинации' })
  async findAll(
    @Query() query: PaginationQuery,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rooms = await this.roomsService.findAll();
    return paginate(rooms, query, res, '/api/rooms');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить номер по ID' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 200, description: 'Номер найден', type: Room })
  @ApiResponse({ status: 400, description: 'Некорректный UUID' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать номер' })
  @ApiResponse({ status: 201, description: 'Номер создан', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Полное обновление номера (все поля)' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 200, description: 'Номер обновлён', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частичное обновление номера (отдельные поля)' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 200, description: 'Номер обновлён', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить номер' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 204, description: 'Номер удалён' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.remove(id);
  }
}
