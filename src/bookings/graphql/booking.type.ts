import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { GuestType } from '../../guests/graphql/guest.type';
import { RoomType } from '../../rooms/graphql/room.type';
import { ServiceType } from '../../services/graphql/service.type';

@ObjectType({ description: 'Бронирование номера' })
export class BookingType {
  @Field(() => ID, { description: 'Уникальный идентификатор' })
  id: string;

  @Field({ description: 'Дата заезда (YYYY-MM-DD)' })
  checkInDate: string;

  @Field({ description: 'Дата выезда (YYYY-MM-DD)' })
  checkOutDate: string;

  @Field({ description: 'Статус: pending, confirmed, cancelled, completed' })
  status: string;

  @Field(() => Float, { description: 'Итоговая стоимость' })
  totalPrice: number;

  @Field(() => GuestType, { nullable: true, description: 'Гость', complexity: 2 })
  guest?: GuestType;

  @Field(() => RoomType, { nullable: true, description: 'Номер', complexity: 2 })
  room?: RoomType;

  @Field(() => [ServiceType], { nullable: true, description: 'Доп. услуги', complexity: 3 })
  services?: ServiceType[];
}

@ObjectType({ description: 'Страница бронирований с пагинацией' })
export class BookingPage {
  @Field(() => [BookingType], { description: 'Список бронирований' })
  data: BookingType[];

  @Field(() => Int, { description: 'Всего записей' })
  total: number;

  @Field(() => Int, { description: 'Текущая страница' })
  page: number;

  @Field(() => Int, { description: 'Записей на странице' })
  limit: number;

  @Field(() => Int, { description: 'Всего страниц' })
  totalPages: number;
}
