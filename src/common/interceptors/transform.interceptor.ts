import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number; // إضافة كود الحالة
  message: string; // الرسالة
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode; // سحب الـ StatusCode (مثلاً 201 عند الإنشاء)

    return next.handle().pipe(
      map((data) => {
        // التحقق مما إذا كان الـ Controller يرسل رسالة مخصصة
        const customMessage = data?.message || 'Request processed successfully';

        // استخراج البيانات الفعلية (إذا كانت مغلفة في كائن يحتوي على رسالة)
        const resultData = data?.results !== undefined ? data.results : data;

        return {
          success: true,
          statusCode: statusCode,
          message: customMessage,
          data: resultData,
        };
      }),
    );
  }
}
