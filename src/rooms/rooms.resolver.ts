import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { RoomType } from './graphql/room.type';
import { CreateRoomInput, UpdateRoomInput } from './graphql/room.input';

@Resolver(() => RoomType)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Query(() => [RoomType], {
    name: 'rooms',
    description: 'Получить список всех номеров',
    complexity: 2,
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @Query(() => RoomType, {
    name: 'room',
    description: 'Получить номер по ID',
    complexity: 1,
  })
  findOne(@Args('id', { type: () => ID, description: 'UUID номера' }) id: string) {
    return this.roomsService.findOne(id);
  }

  @Mutation(() => RoomType, {
    description: 'Создать новый номер',
  })
  createRoom(@Args('input', { description: 'Данные номера' }) input: CreateRoomInput) {
    return this.roomsService.create(input as any);
  }

  @Mutation(() => RoomType, {
    description: 'Обновить данные номера',
  })
  updateRoom(
    @Args('id', { type: () => ID, description: 'UUID номера' }) id: string,
    @Args('input', { description: 'Новые данные' }) input: UpdateRoomInput,
  ) {
    return this.roomsService.update(id, input as any);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить номер',
  })
  async deleteRoom(@Args('id', { type: () => ID, description: 'UUID номера' }) id: string) {
    await this.roomsService.remove(id);
    return true;
  }
}
