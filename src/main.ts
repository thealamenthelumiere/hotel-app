import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'src', 'public'), {
    index: 'page.html',
  });
  const staticPath = join(__dirname, '..', 'src', 'public');
  console.log('Serving static from:', staticPath);
  app.useStaticAssets(staticPath, { index: 'page.html' });
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Сервер запущен на порту ${port}`);
}

bootstrap().catch((err) => {
  console.error('Ошибка при запуске сервера:', err);
  process.exit(1);
});
