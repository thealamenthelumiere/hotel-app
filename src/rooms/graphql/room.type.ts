import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Номер отеля' })
export class RoomType {
  @Field(() => ID, { description: 'Уникальный идентификатор' })
  id: string;

  @Field({ description: 'Номер комнаты (например, 101)' })
  number: string;

  @Field({ description: 'Тип номера: стандарт, люкс и т.д.' })
  type: string;

  @Field(() => Float, { description: 'Цена за ночь в рублях' })
  pricePerNight: number;

  @Field(() => Int, { description: 'Вместимость (кол-во гостей)' })
  capacity: number;

  @Field({ nullable: true, description: 'Описание номера' })
  description?: string;

  @Field({ nullable: true, description: 'URL фото номера в объектном хранилище' })
  imageUrl?: string;
}
