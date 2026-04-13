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

    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session as { userId?: string; userRole?: string };

    if (!session?.userId) {
      throw new ForbiddenException('Необходима авторизация');
    }

    if (!requiredRoles.includes(session.userRole as UserRole)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
