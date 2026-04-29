import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Дополнительная услуга отеля' })
export class ServiceType {
  @Field(() => ID, { description: 'Уникальный идентификатор' })
  id: string;

  @Field({ description: 'Название услуги' })
  name: string;

  @Field({ nullable: true, description: 'Описание услуги' })
  description?: string;

  @Field(() => Float, { description: 'Цена услуги в рублях' })
  price: number;

  @Field(() => Int, { nullable: true, description: 'Длительность в минутах' })
  duration?: number;
}
