import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Применяется к MVC-маршрутам, требующим авторизации:
// перенаправляет неаутентифицированного пользователя на страницу входа
@Injectable()
export class AuthSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const session = req.session as { userId?: string };
    if (!session?.userId) {
      return res.redirect('/auth/login');
    }
    next();
  }
}
