import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

interface Room {
  id: number;
  title: string;
  description: string;
  capacity: number;
  price: number;
  isAvailable?: boolean;
}

@Injectable()
export class RoomsService {
  private rooms: Room[] = [
    {
      id: 1,
      title: 'Люкс',
      description: 'Просторный номер',
      capacity: 2,
      price: 15000,
      isAvailable: true,
    },
    {
      id: 2,
      title: 'Стандарт',
      description: 'Уютный номер',
      capacity: 2,
      price: 8000,
      isAvailable: true,
    },
  ];

  findAllPaginated(page: number = 1, limit: number = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.rooms.slice(start, end);
    const total = this.rooms.length;

    const lastPage = Math.ceil(total / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < lastPage ? page + 1 : null;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage,
        prevPage,
        nextPage,
      },
      links: {
        self: `/api/rooms?page=${page}&limit=${limit}`,
        prev: prevPage ? `/api/rooms?page=${prevPage}&limit=${limit}` : null,
        next: nextPage ? `/api/rooms?page=${nextPage}&limit=${limit}` : null,
      },
    };
  }

  findOne(id: number): Room {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) throw new NotFoundException(`Room with ID ${id} not found`);
    return room;
  }

  create(createRoomDto: CreateRoomDto): Room {
    const newId = this.rooms.length
      ? Math.max(...this.rooms.map((r) => r.id)) + 1
      : 1;
    const newRoom: Room = { id: newId, ...createRoomDto };
    this.rooms.push(newRoom);
    return newRoom;
  }

  update(id: number, updateRoomDto: UpdateRoomDto): Room {
    const index = this.rooms.findIndex((r) => r.id === id);
    if (index === -1)
      throw new NotFoundException(`Room with ID ${id} not found`);
    const updated = { ...this.rooms[index], ...updateRoomDto };
    this.rooms[index] = updated;
    return updated;
  }

  remove(id: number): Room {
    const index = this.rooms.findIndex((r) => r.id === id);
    if (index === -1)
      throw new NotFoundException(`Room with ID ${id} not found`);
    const deleted = this.rooms[index];
    this.rooms.splice(index, 1);
    return deleted;
  }
}
