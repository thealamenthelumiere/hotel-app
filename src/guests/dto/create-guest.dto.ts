import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя гостя' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+79123456789',
    description: 'Номер телефона',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('RU') // или укажите код страны
  phone?: string;

  @ApiProperty({
    example: 'Москва',
    description: 'Город проживания',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;
}
