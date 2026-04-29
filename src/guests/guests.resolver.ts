import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GuestsService } from './guests.service';
import { GuestType } from './graphql/guest.type';
import { CreateGuestInput, UpdateGuestInput } from './graphql/guest.input';

@Resolver(() => GuestType)
export class GuestsResolver {
  constructor(private readonly guestsService: GuestsService) {}

  @Query(() => [GuestType], {
    name: 'guests',
    description: 'Получить список всех гостей',
    complexity: 2,
  })
  findAll() {
    return this.guestsService.findAll();
  }

  @Query(() => GuestType, {
    name: 'guest',
    description: 'Получить гостя по ID',
    complexity: 1,
  })
  findOne(@Args('id', { type: () => ID, description: 'UUID гостя' }) id: string) {
    return this.guestsService.findOne(id);
  }

  @Mutation(() => GuestType, {
    description: 'Создать профиль гостя',
  })
  createGuest(@Args('input', { description: 'Данные гостя' }) input: CreateGuestInput) {
    return this.guestsService.create(input as any);
  }

  @Mutation(() => GuestType, {
    description: 'Обновить данные гостя',
  })
  updateGuest(
    @Args('id', { type: () => ID, description: 'UUID гостя' }) id: string,
    @Args('input', { description: 'Новые данные' }) input: UpdateGuestInput,
  ) {
    return this.guestsService.update(id, input as any);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить гостя',
  })
  async deleteGuest(@Args('id', { type: () => ID, description: 'UUID гостя' }) id: string) {
    await this.guestsService.remove(id);
    return true;
  }
}
