import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { configs } from "./config";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { UploadModule } from "./upload/upload.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseCacheInterceptor } from "./global/response-cache.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get("cache"),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get("database"),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    UploadModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    SequelizeModule,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseCacheInterceptor,
    },
  ],
})
export class AppModule {}
