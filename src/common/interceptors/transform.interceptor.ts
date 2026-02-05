import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const message = data?.message ?? 'Request processed successfully';
        const dataExcludeMessage = { ...data };
        delete dataExcludeMessage.message;
        return {
          success: true,
          statusCode,
          message,
          // remove message from data for none repeat
          ...(data?.results ?? dataExcludeMessage),
        };
      }),
    );
  }
}
