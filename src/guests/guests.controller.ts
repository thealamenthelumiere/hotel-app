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
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @Render('guests/index')
  async index(@Req() req: Request) {
    const guests = await this.guestsService.findAll();
    const session = req.session as { userId?: string; userRole?: string; userName?: string };
    return {
      guests,
      isAuthenticated: !!session.userId,
      isAdmin: session.userRole === UserRole.ADMIN,
      user: session.userName || null,
    };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('guests/add')
  addForm() {
    return {};
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/guests')
  async create(@Body() createGuestDto: CreateGuestDto) {
    await this.guestsService.create(createGuestDto);
  }

  @Get(':id')
  @Render('guests/show')
  async show(@Param('id') id: string) {
    const guest = await this.guestsService.findOne(id);
    return { guest };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('guests/edit')
  async editForm(@Param('id') id: string) {
    const guest = await this.guestsService.findOne(id);
    return { guest };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/guests')
  async update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    await this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/guests')
  async remove(@Param('id') id: string) {
    await this.guestsService.remove(id);
  }
}
