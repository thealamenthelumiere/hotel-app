import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';

function sessionLocals(req: Request) {
  const session = req.session as {
    userId?: string;
    userRole?: string;
    userName?: string;
  };
  return {
    isAuthenticated: !!session.userId,
    isAdmin: session.userRole === 'admin',
    user: session.userName || null,
  };
}

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndex(@Req() req: Request) {
    const rooms = [
      { title: 'Люкс', description: 'Номер комфорт класса с двумя спальнями' },
      { title: 'Стандарт', description: 'Номер с двухместной кроватью и всеми удобствами' },
    ];
    return { ...sessionLocals(req), rooms };
  }

  @Get('about')
  @Render('about')
  getAbout(@Req() req: Request) {
    return { ...sessionLocals(req), title: 'О нас - Талион Империал' };
  }

  @Get('contact')
  @Render('contact')
  getContact(@Req() req: Request) {
    return { ...sessionLocals(req), title: 'Контакты - Талион Империал' };
  }

  @Get('rooms')
  @Render('rooms')
  getRooms(@Req() req: Request) {
    const rooms = [
      { title: 'Стандарт', description: 'Уютный номер с современным дизайном и всеми удобствами.' },
      { title: 'Люкс', description: 'Просторный номер с гостиной зоной и панорамным видом.' },
    ];
    return { ...sessionLocals(req), title: 'Номера - Талион Империал', rooms };
  }

  @Get('constructor')
  @Render('constructor')
  getConstructor(@Req() req: Request) {
    return { ...sessionLocals(req), title: 'Конструктор расписания - Талион Империал' };
  }

  @Get('reviews')
  @Render('reviews')
  getReviews(@Req() req: Request) {
    return { ...sessionLocals(req), title: 'Отзывы - Талион Империал' };
  }
}
