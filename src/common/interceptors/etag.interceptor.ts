import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { createHash } from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    // Только GET-запросы к REST API
    if (req.method !== 'GET' || !req.path.startsWith('/api/')) {
      return next.handle();
    }

    return next.handle().pipe(
      mergeMap(data => {
        if (data == null) return of(data);

        const body = JSON.stringify(data);
        const etag = `"${createHash('md5').update(body).digest('hex')}"`;

        res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'max-age=3600, must-revalidate');

        const ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch === etag) {
          res.status(304).end();
          return EMPTY;
        }

        return of(data);
      }),
    );
  }
}
