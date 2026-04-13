import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID бронирования' })
  @IsInt()
  @IsPositive()
  bookingId: number;

  @ApiProperty({ example: 15000, description: 'Сумма платежа' })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
    description: 'Способ оплаты',
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Дата оплаты',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
