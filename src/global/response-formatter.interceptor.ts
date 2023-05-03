import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 操作成功的响应体格式
        const body: ResponseBodyContent = {
          success: true,
          message: 'success',
          status_code: 200, // 成功
          data,
        };
        return body;
      })
    );
  }
}
