import { NestFactory } from "@nestjs/core";
import { ResponseFormatterInterceptor } from "./global/response-formatter.interceptor";
import { ExceptionHandlerFilter } from "./global/exception-handler.filter";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

const { UPLOAD_DIR, APP_PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 允许跨域
  app.enableCors();

  // 设置静态文件访问
  app.useStaticAssets(UPLOAD_DIR);

  // api 前缀
  app.setGlobalPrefix("/api");

  // 设置全局数据验证管道: 验证参数
  app.useGlobalPipes(new ValidationPipe());

  // 设置全局异常处理: 统一返回 json 格式
  app.useGlobalFilters(new ExceptionHandlerFilter());

  // 设置全局拦截器: 格式化响应体
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  await app.listen(APP_PORT || 3000);
}
bootstrap();
