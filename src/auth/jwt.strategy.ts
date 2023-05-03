import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService, private readonly config: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate({ sub: id }): Promise<any> {
    const user = await this.authService.validateUser(id);
    if (!user) {
      throw new UnauthorizedException('登录验证失败');
    }
    return user;
  }
}
