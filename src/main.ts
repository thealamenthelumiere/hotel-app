import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import session = require('express-session');
import methodOverride = require('method-override');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Hotel API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Сервер запущен на http://localhost:${port}`);
}

bootstrap();
