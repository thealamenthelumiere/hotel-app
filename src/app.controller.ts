import { Controller, Get, Render, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndex(@Query('auth') auth: string) {
    // Если auth=1, считаем пользователя авторизованным
    const isAuthenticated = auth === '1';
    // Имя пользователя можно задать статически (или брать из сессии в будущем)
    const user = isAuthenticated ? 'Гость' : null;

    // Пример данных для номеров (можно оставить как есть)
    const rooms = [
      { title: 'Люкс', description: 'Номер комфорт класса с двумя спальнями' },
      {
        title: 'Стандарт',
        description: 'Номер с двухместной кроватью и всеми удобствами',
      },
    ];

    return { isAuthenticated, user, rooms };
  }

  @Get('about')
  @Render('about')
  getAbout(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return {
      isAuthenticated: Boolean,
      user,
      title: 'О нас - Талион Империал', // для тега <title>
    };
  }
  @Get('contact')
  @Render('contact')
  getContact(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return {
      isAuthenticated,
      user,
      title: 'Контакты - Талион Империал',
    };
  }
  @Get('rooms')
  @Render('rooms')
  getRooms(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    // Позже здесь можно получать реальные данные из базы
    const rooms = [
      {
        title: 'Стандарт',
        description: 'Уютный номер с современным дизайном и всеми удобствами.',
      },
      {
        title: 'Люкс',
        description: 'Просторный номер с гостиной зоной и панорамным видом.',
      },
    ];
    return {
      isAuthenticated,
      user,
      title: 'Номера - Талион Империал',
      rooms,
    };
  }
  @Get('constructor')
  @Render('constructor')
  getConstructor(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return {
      isAuthenticated,
      user,
      title: 'Конструктор расписания - Талион Империал',
    };
  }
  @Get('services')
  @Render('services')
  getServices(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return {
      isAuthenticated,
      user,
      title: 'Услуги - Талион Империал',
    };
  }
  @Get('reviews')
  @Render('reviews')
  getReviews(@Query('auth') auth: string) {
    const isAuthenticated = auth === '1';
    const user = isAuthenticated ? 'Гость' : null;
    return {
      isAuthenticated,
      user,
      title: 'Отзывы - Талион Империал',
    };
  }
}
