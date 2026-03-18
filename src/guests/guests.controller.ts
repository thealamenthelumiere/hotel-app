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
  Query,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @Render('guests/index')
  async index(@Query('auth') auth: string) {
    const guests = await this.guestsService.findAll();
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return { guests, isAuthenticated, user };
    //console.log('Guests count:', guests.length);
    //return { guests };
  }

  @Get('add')
  @Render('guests/add')
  addForm() {
    return {};
  }

  @Post()
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
  @Render('guests/edit')
  async editForm(@Param('id') id: string) {
    const guest = await this.guestsService.findOne(id);
    return { guest };
  }

  @Put(':id')
  @Redirect('/guests')
  async update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    await this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @Redirect('/guests')
  async remove(@Param('id') id: string) {
    await this.guestsService.remove(id);
  }
}
