import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const type = context.getType();

    if (type === 'http') {
      const http = context.switchToHttp();
      const req = http.getRequest<Request>();
      const res = http.getResponse<Response>();
      const isApi = req.path.startsWith('/api/');

      return next.handle().pipe(
        map(data => {
          const elapsed = Date.now() - start;
          this.logger.log(`[${req.method}] ${req.path} — ${elapsed}ms`);

          if (isApi) {
            res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
            return data;
          }
          // MVC: inject serverTime into template context
          if (data && typeof data === 'object') {
            return { ...data, serverTime: elapsed };
          }
          return data;
        }),
      );
    }

    // GraphQL: только логируем
    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        this.logger.log(`[GraphQL] — ${elapsed}ms`);
      }),
    );
  }
}
