import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { ServiceType } from './graphql/service.type';
import { CreateServiceInput, UpdateServiceInput } from './graphql/service.input';

@Resolver(() => ServiceType)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Query(() => [ServiceType], {
    name: 'services',
    description: 'Получить список всех услуг',
    complexity: 2,
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Query(() => ServiceType, {
    name: 'service',
    description: 'Получить услугу по ID',
    complexity: 1,
  })
  findOne(@Args('id', { type: () => ID, description: 'UUID услуги' }) id: string) {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => ServiceType, {
    description: 'Создать услугу',
  })
  createService(@Args('input', { description: 'Данные услуги' }) input: CreateServiceInput) {
    return this.servicesService.create(input as any);
  }

  @Mutation(() => ServiceType, {
    description: 'Обновить услугу',
  })
  updateService(
    @Args('id', { type: () => ID, description: 'UUID услуги' }) id: string,
    @Args('input', { description: 'Новые данные' }) input: UpdateServiceInput,
  ) {
    return this.servicesService.update(id, input as any);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить услугу',
  })
  async deleteService(@Args('id', { type: () => ID, description: 'UUID услуги' }) id: string) {
    await this.servicesService.remove(id);
    return true;
  }
}
