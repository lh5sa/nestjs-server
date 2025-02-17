import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthStrategy } from "./jwt-auth.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UsersModule } from "src/users/users.module";
import { RbacAuthGuard } from "./rbac-auth.guard";

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ defaultStrategy: "jwt-auth" }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			global: true,
			useFactory: (config: ConfigService) =>
				config.get("jwt.accessTokenOptions"),
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtAuthStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RbacAuthGuard,
		},
	],
})
export class AuthModule {}
