import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { BookingType } from '../../bookings/graphql/booking.type';

@ObjectType({ description: 'Платёж за бронирование' })
export class PaymentType {
  @Field(() => ID, { description: 'Уникальный идентификатор' })
  id: string;

  @Field(() => Float, { description: 'Сумма платежа' })
  amount: number;

  @Field({ description: 'Дата платежа' })
  paymentDate: string;

  @Field({ description: 'Способ оплаты: cash, card, online' })
  method: string;

  @Field({ description: 'Статус: pending, paid, refunded' })
  status: string;

  @Field(() => BookingType, { nullable: true, description: 'Связанное бронирование', complexity: 3 })
  booking?: BookingType;
}
