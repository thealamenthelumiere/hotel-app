import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive, IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-бронирования', description: 'ID бронирования (UUID)' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: 15000, description: 'Сумма платежа' })
  @Type(() => Number)
  @IsNumber()
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

  @ApiProperty({
    example: 'pending',
    description: 'Статус платежа: pending, paid, refunded',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
