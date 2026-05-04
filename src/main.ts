import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import session = require('express-session');
import methodOverride = require('method-override');
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS — разрешаем браузерам слать Authorization-заголовок с JWT
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'If-None-Match'],
    exposedHeaders: ['ETag', 'X-Elapsed-Time', 'X-Total-Count', 'Link', 'Cache-Control'],
    credentials: true,
  });

  // Статические файлы и шаблоны
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // Сессии
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'hotel-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );

  // Method override: позволяет формам отправлять PUT и DELETE через POST + ?_method=PUT
  app.use(methodOverride('_method'));

  // Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }),
  );

  // Глобальный фильтр исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger с поддержкой Bearer-авторизации (замочки на защищённых методах)
  const config = new DocumentBuilder()
    .setTitle('Hotel API')
    .setDescription(
      'REST API для системы бронирования отеля «Талион Империал».\n\n' +
      'GET-эндпоинты публичны. POST/PUT/PATCH/DELETE требуют Bearer JWT.\n' +
      'Получить токен: **POST /api/auth/login**',
    )
    .setVersion('1.0')
    .addTag('auth', 'Аутентификация')
    .addTag('rooms', 'Управление номерами')
    .addTag('bookings', 'Бронирования')
    .addTag('guests', 'Гости')
    .addTag('services', 'Дополнительные услуги')
    .addTag('payments', 'Платежи')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customJsStr: `
      (function() {
        const _fetch = window.fetch;
        window.fetch = async function(...args) {
          const response = await _fetch.apply(this, args);
          try {
            const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
            if (url.includes('/api/auth/login')) {
              const body = await response.clone().json();
              if (body && body.accessToken && window.ui) {
                window.ui.authActions.authorize({
                  JWT: {
                    name: 'JWT',
                    schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
                    value: body.accessToken,
                  },
                });
              }
            }
          } catch(e) {}
          return response;
        };
      })();
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Сервер запущен на http://localhost:${port}`);

  // Создаём учётную запись администратора при старте (если не существует)
  try {
    const usersService = app.get(UsersService);
    await usersService.createAdmin(
      process.env.ADMIN_EMAIL || 'admin@hotel.ru',
      process.env.ADMIN_PASSWORD || 'admin123',
      'Администратор',
    );
    console.log('Администратор готов: admin@hotel.ru');
  } catch (e: unknown) {
    console.warn('Не удалось создать администратора:', e instanceof Error ? e.message : e);
  }
}

bootstrap();
