import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data = null) => {
        // 操作成功的响应体格式
        const body: ResponseBodyStruct = {
          success: true,
          msg: "success",
          data,
        };
        return body;
      })
    );
  }
}
