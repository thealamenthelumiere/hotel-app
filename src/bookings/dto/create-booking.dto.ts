// create-booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
  //IsInt,
  //IsPositive,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-гостя', description: 'ID гостя (UUID)' })
  @IsUUID()
  guestId: string;

  @ApiProperty({ example: 'uuid-комнаты', description: 'ID комнаты (UUID)' })
  @IsUUID()
  roomId: string;

  @ApiProperty({
    example: '2025-06-01',
    description: 'Дата заезда (YYYY-MM-DD)',
  })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({
    example: '2025-06-05',
    description: 'Дата выезда (YYYY-MM-DD)',
  })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({
    example: ['service-uuid-1', 'service-uuid-2'],
    description: 'ID услуг (опционально)',
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  serviceIds?: string[];

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    required: false,
  })
  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed'])
  @IsOptional()
  status?: string;
}
