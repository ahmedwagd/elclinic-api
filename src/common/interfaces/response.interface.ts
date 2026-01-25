export interface Response<T> {
  success: boolean;
  statusCode: number; // إضافة كود الحالة
  message: string; // الرسالة
  data: T;
}
