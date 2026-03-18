import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`Номер с ID ${id} не найден`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    await this.roomsRepository.update(id, updateRoomDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Номер с ID ${id} не найден`);
    }
  }
}
