import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  Res,
  Req,
  Render,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('login')
  @Render('auth/login')
  getLogin(@Req() req: Request) {
    const session = req.session as { userId?: string };
    if (session.userId) return { redirect: '/' };
    return { error: null };
  }

  @Get('register')
  @Render('auth/register')
  getRegister(@Req() req: Request) {
    const session = req.session as { userId?: string };
    if (session.userId) return { redirect: '/' };
    return { error: null };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.register(createUserDto);
      return res.redirect('/auth/login');
    } catch {
      return res.status(HttpStatus.OK).render('auth/register', {
        error: 'Пользователь с таким email уже существует',
      });
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      return res.status(HttpStatus.OK).render('auth/login', {
        error: 'Неверный email или пароль',
      });
    }
    const session = req.session as {
      userId?: string;
      userRole?: string;
      userName?: string;
      userEmail?: string;
    };
    session.userId = user.id;
    session.userRole = user.role;
    session.userName = user.name || user.email;
    session.userEmail = user.email;
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
}
