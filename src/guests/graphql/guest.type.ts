import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Гость отеля' })
export class GuestType {
  @Field(() => ID, { description: 'Уникальный идентификатор' })
  id: string;

  @Field({ description: 'Полное имя гостя' })
  name: string;

  @Field({ description: 'Email гостя' })
  email: string;

  @Field({ nullable: true, description: 'Номер телефона' })
  phone?: string;
}
