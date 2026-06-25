import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // GraphQL — пропускаем (обрабатывается отдельно)
    if (context.getType() !== 'http') return true;

    const req = context.switchToHttp().getRequest<Request>();
    const path = req.path;

    // MVC-маршруты — авторизация через сессию (middleware обеспечивает редирект)
    if (!path.startsWith('/api/') && !path.startsWith('/graphql')) {
      const session = req.session as { userId?: string; userRole?: string; userName?: string };
      if (session?.userId) {
        (req as any).user = { id: session.userId, role: session.userRole, name: session.userName };
      }
      return true;
    }

    // GET-запросы к API публичны по умолчанию, но токен всё равно извлекаем
    if (req.method === 'GET') {
      this.tryExtractUser(req);
      return true;
    }

    // POST/PUT/PATCH/DELETE к API — требуется Bearer JWT
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Требуется авторизация: Bearer токен');
    }

    try {
      const payload = this.authService.verifyToken(authHeader.slice(7));
      (req as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Недействительный или истёкший токен');
    }
  }

  private tryExtractUser(req: Request): void {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const payload = this.authService.verifyToken(authHeader.slice(7));
        (req as any).user = payload;
      }
    } catch {
      // Игнорируем — GET публичный
    }
  }
}
