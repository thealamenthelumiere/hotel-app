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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Render('services/index')
  async index() {
    const services = await this.servicesService.findAll();
    return { services };
  }

  @Get('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('services/add')
  addForm() {
    return {};
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
  async show(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return { service };
  }

  @Get(':id/edit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('services/edit')
  async editForm(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return { service };
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
