import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// تعريف واجهة الاستجابة (Interface)
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
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
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        // إذا كانت البيانات تحتوي على رسالة مخصصة، نفصلها عن البيانات الأساسية
        message: data?.message || 'Request processed successfully',
        data: data?.results || data, // نمرر البيانات الفعلية
      })),
    );
  }
}
