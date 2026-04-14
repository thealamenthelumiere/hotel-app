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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
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

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Render('services/index')
  async index(@Req() req: Request) {
    const services = await this.servicesService.findAll();
    return { services, ...sessionLocals(req) };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('services/add')
  addForm(@Req() req: Request) {
    return { ...sessionLocals(req) };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/services')
  async create(@Body() createServiceDto: CreateServiceDto) {
    await this.servicesService.create(createServiceDto);
  }

  @Get(':id')
  @Render('services/show')
  async show(@Param('id') id: string, @Req() req: Request) {
    const service = await this.servicesService.findOne(id);
    return { service, ...sessionLocals(req) };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('services/edit')
  async editForm(@Param('id') id: string, @Req() req: Request) {
    const service = await this.servicesService.findOne(id);
    return { service, ...sessionLocals(req) };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/services')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    await this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Redirect('/services')
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
  }
}
