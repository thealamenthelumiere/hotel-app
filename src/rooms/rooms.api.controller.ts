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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor, Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Response } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { paginate, PaginationQuery } from '../common/pagination';
import { StorageService } from '../storage/storage.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('rooms')
@Controller('api/rooms')
export class RoomsApiController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor)
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

  @UseInterceptors(CacheInterceptor)
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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Создать номер' })
  @ApiResponse({ status: 201, description: 'Номер создан', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Полное обновление номера (все поля)' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 200, description: 'Номер обновлён', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Частичное обновление номера (отдельные поля)' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 200, description: 'Номер обновлён', type: Room })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Post(':id/image')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Загрузить фото номера в Yandex Object Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Фото (jpg/png/webp, до 5MB)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Фото загружено, ссылка сохранена', type: Room })
  @ApiResponse({ status: 400, description: 'Неверный формат или размер файла' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const ext = file.originalname.split('.').pop() ?? 'jpg';
    const key = `rooms/${id}-${Date.now()}.${ext}`;
    const imageUrl = await this.storageService.upload(key, file.buffer, file.mimetype);
    const updated = await this.roomsService.update(id, { imageUrl } as UpdateRoomDto);
    await this.cacheManager.clear();
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить номер (только администратор)' })
  @ApiParam({ name: 'id', description: 'UUID номера' })
  @ApiResponse({ status: 204, description: 'Номер удалён' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Номер не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.remove(id);
  }
}
