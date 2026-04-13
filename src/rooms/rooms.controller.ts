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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Render('rooms/index')
  async index() {
    const rooms = await this.roomsService.findAll();
    return { rooms };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('rooms/add')
  addForm() {
    return {};
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/rooms')
  async create(@Body() createRoomDto: CreateRoomDto) {
    await this.roomsService.create(createRoomDto);
  }

  @Get(':id')
  @Render('rooms/show')
  async show(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);
    return { room };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('rooms/edit')
  async editForm(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);
    return { room };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/rooms')
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    await this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/rooms')
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
  }
}
