import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicAccess } from './public.decorator';

class LoginDto {
  @ApiProperty({ example: 'admin@hotel.ru', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Пароль (мин. 6 символов)' })
  @IsString()
  @MinLength(6)
  password: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Войти и получить JWT токен' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Авторизация успешна, возвращает accessToken',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs...',
        user: { id: 'uuid', email: 'admin@hotel.ru', name: 'Администратор', role: 'admin' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учётные данные' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
