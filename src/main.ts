import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
//import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Включение версионирования (если нужно)
  app.enableVersioning({
    type: VersioningType.URI, // или Header, MediaType
    defaultVersion: '1', // строка или символ (не unique symbol)
  });

  // 2. Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Hotel API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // setup возвращает void

  // 3. Запуск сервера
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Сервер запущен на http://localhost:${port}`);
}

bootstrap();
