import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

@InputType({ description: 'Данные для создания услуги' })
export class CreateServiceInput {
  @Field({ description: 'Название услуги' })
  @IsString()
  name: string;

  @Field({ nullable: true, description: 'Описание услуги' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { description: 'Цена услуги' })
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Int, { nullable: true, description: 'Длительность в минутах' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}

@InputType({ description: 'Данные для обновления услуги' })
export class UpdateServiceInput {
  @Field({ nullable: true, description: 'Название услуги' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true, description: 'Описание услуги' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true, description: 'Цена услуги' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Int, { nullable: true, description: 'Длительность в минутах' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}
