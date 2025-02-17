import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "src/models/user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt-auth") {
  constructor(private readonly authService: AuthService, config: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromHeader("token"),
      secretOrKey: config.get("jwt.accessTokenOptions.secret"),
    });
  }

  // passport jwt 验证策略
  async validate({ sub: id }): Promise<UserModel> {
    const user = await this.authService.validateUser(id);
    if (!user) {
      throw new UnauthorizedException("登录验证失败");
    }
    return user;
  }
}
