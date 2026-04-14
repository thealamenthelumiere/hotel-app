import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestsRepository.create(createGuestDto);
    return this.guestsRepository.save(guest);
  }

  async findAll(): Promise<Guest[]> {
    return this.guestsRepository.find();
  }

  async findOne(id: string): Promise<Guest> {
    return this.guestsRepository.findOneOrFail({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Guest | null> {
    return this.guestsRepository.findOne({ where: { userId } });
  }

  async findOrCreateByUser(userId: string, name: string, email: string): Promise<Guest> {
    let guest = await this.findByUserId(userId);
    if (!guest) {
      guest = this.guestsRepository.create({ name, email, userId });
      guest = await this.guestsRepository.save(guest);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    await this.guestsRepository.update(id, updateGuestDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.guestsRepository.delete(id);
  }
}
