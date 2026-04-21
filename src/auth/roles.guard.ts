import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest<Request>();

    // Получаем роль из JWT-payload (установлен AuthGuard) или из сессии
    const user = (req as any).user as { role?: string } | undefined;
    const session = req.session as { userRole?: string };
    const role = user?.role ?? session?.userRole;

    if (!role) throw new ForbiddenException('Необходима авторизация');
    if (!requiredRoles.includes(role as UserRole)) {
      throw new ForbiddenException('Недостаточно прав. Требуется: ' + requiredRoles.join(', '));
    }

    return true;
  }
}
