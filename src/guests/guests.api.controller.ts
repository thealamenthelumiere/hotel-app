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
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { paginate, PaginationQuery } from '../common/pagination';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('guests')
@Controller('api/guests')
export class GuestsApiController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Получить или создать профиль гостя текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль гостя', type: Guest })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  async getMe(@Req() req: Request) {
    const user = (req as any).user as { sub?: string; email?: string; role?: string } | undefined;
    if (!user?.sub) throw new UnauthorizedException('Требуется авторизация');
    return this.guestsService.findOrCreateByUser(user.sub, user.email ?? '', user.email ?? '');
  }

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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Создать профиль гостя' })
  @ApiResponse({ status: 201, description: 'Гость создан', type: Guest })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Полное обновление гостя' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 200, description: 'Гость обновлён', type: Guest })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Частичное обновление гостя' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 200, description: 'Гость обновлён', type: Guest })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удалить гостя (только администратор)' })
  @ApiParam({ name: 'id', description: 'UUID гостя' })
  @ApiResponse({ status: 204, description: 'Гость удалён' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Гость не найден' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.guestsService.remove(id);
  }
}
