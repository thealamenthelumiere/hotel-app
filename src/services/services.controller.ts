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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

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
  @Render('services/add')
  addForm() {
    return {};
  }

  @Post()
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
  @Render('services/edit')
  async editForm(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return { service };
  }

  @Put(':id')
  @Redirect('/services')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    await this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Redirect('/services')
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
  }
}
