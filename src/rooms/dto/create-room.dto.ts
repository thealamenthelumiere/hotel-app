import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Номер комнаты' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'Люкс', description: 'Тип номера' })
  @IsString()
  type: string;

  @ApiProperty({ example: 5000, description: 'Цена за ночь' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerNight: number;

  @ApiProperty({ example: 2, description: 'Вместимость' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 'Просторный номер', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://storage.yandexcloud.net/...', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
