import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Спа-процедура', description: 'Название услуги' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Расслабляющий массаж',
    description: 'Описание услуги',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 3000, description: 'Цена' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 60,
    description: 'Длительность в минутах',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}
