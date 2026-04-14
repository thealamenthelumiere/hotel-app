import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsUUID, IsNumber, IsPositive, IsEnum, IsOptional } from 'class-validator';

export enum PaymentMethodGql {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

@InputType({ description: 'Данные для создания платежа' })
export class CreatePaymentInput {
  @Field(() => ID, { description: 'ID бронирования' })
  @IsUUID()
  bookingId: string;

  @Field(() => Float, { description: 'Сумма платежа' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field({ description: 'Способ оплаты: cash, card, online' })
  @IsEnum(PaymentMethodGql)
  method: string;
}

@InputType({ description: 'Данные для обновления платежа' })
export class UpdatePaymentInput {
  @Field(() => Float, { nullable: true, description: 'Сумма платежа' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @Field({ nullable: true, description: 'Способ оплаты' })
  @IsOptional()
  @IsEnum(PaymentMethodGql)
  method?: string;
}
