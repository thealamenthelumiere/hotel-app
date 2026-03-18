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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

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
  @Render('rooms/add')
  addForm() {
    return {};
  }

  @Post()
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
  @Render('rooms/edit')
  async editForm(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);
    return { room };
  }

  @Put(':id')
  @Redirect('/rooms')
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    await this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @Redirect('/rooms')
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
  }
}
