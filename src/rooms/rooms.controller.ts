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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
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

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Render('rooms/index')
  async index(@Req() req: Request) {
    const rooms = await this.roomsService.findAll();
    return { rooms, ...sessionLocals(req) };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('rooms/add')
  addForm(@Req() req: Request) {
    return { ...sessionLocals(req) };
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
  async show(@Param('id') id: string, @Req() req: Request) {
    const room = await this.roomsService.findOne(id);
    return { room, ...sessionLocals(req) };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('rooms/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const room = await this.roomsService.findOne(id);
    return { room, ...sessionLocals(req) };
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
