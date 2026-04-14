import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

@InputType({ description: 'Данные для создания номера' })
export class CreateRoomInput {
  @Field({ description: 'Номер комнаты (например, 101)' })
  @IsString()
  number: string;

  @Field({ description: 'Тип номера: стандарт, люкс и т.д.' })
  @IsString()
  type: string;

  @Field(() => Float, { description: 'Цена за ночь' })
  @IsNumber()
  @IsPositive()
  pricePerNight: number;

  @Field(() => Int, { description: 'Вместимость' })
  @IsNumber()
  @Min(1)
  capacity: number;

  @Field({ nullable: true, description: 'Описание номера' })
  @IsOptional()
  @IsString()
  description?: string;
}

@InputType({ description: 'Данные для обновления номера' })
export class UpdateRoomInput {
  @Field({ nullable: true, description: 'Номер комнаты' })
  @IsOptional()
  @IsString()
  number?: string;

  @Field({ nullable: true, description: 'Тип номера' })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => Float, { nullable: true, description: 'Цена за ночь' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerNight?: number;

  @Field(() => Int, { nullable: true, description: 'Вместимость' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @Field({ nullable: true, description: 'Описание номера' })
  @IsOptional()
  @IsString()
  description?: string;
}
