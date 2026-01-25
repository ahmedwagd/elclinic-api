import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    return next.handle().pipe(
      map((result) => {
        if (!result || !result.items || result.total === undefined) {
          return result;
        }

        return {
          data: result.items,
          meta: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
          },
        };
      }),
    );
  }
}
