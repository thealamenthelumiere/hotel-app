import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsDateString, IsOptional, IsArray } from 'class-validator';

@InputType({ description: 'Данные для создания бронирования' })
export class CreateBookingInput {
  @Field(() => ID, { description: 'ID гостя' })
  @IsUUID()
  guestId: string;

  @Field(() => ID, { description: 'ID номера' })
  @IsUUID()
  roomId: string;

  @Field({ description: 'Дата заезда (YYYY-MM-DD)' })
  @IsDateString()
  checkInDate: string;

  @Field({ description: 'Дата выезда (YYYY-MM-DD)' })
  @IsDateString()
  checkOutDate: string;

  @Field(() => [ID], { nullable: true, description: 'ID дополнительных услуг' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds?: string[];
}

@InputType({ description: 'Данные для обновления бронирования' })
export class UpdateBookingInput {
  @Field(() => ID, { nullable: true, description: 'ID гостя' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @Field(() => ID, { nullable: true, description: 'ID номера' })
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @Field({ nullable: true, description: 'Дата заезда' })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @Field({ nullable: true, description: 'Дата выезда' })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @Field(() => [ID], { nullable: true, description: 'ID дополнительных услуг' })
  @IsOptional()
  @IsArray()
  serviceIds?: string[];
}
