import { NestFactory, Reflector } from '@nestjs/core';
import { ResponseFormatterInterceptor } from './global/response-formatter.interceptor';
import { ExceptionHandlerFilter } from './global/exception-handler.filter';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionHandlerFilter());
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
