import { Cache } from 'cache-manager';
import { UsersService } from './../users/users.service';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserModel } from 'src/models/user.model';

const MINUTES_TO_MS = 60000; // 6 * 1000

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheMgr: Cache,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  // 登录
  async login(dto: LoginUserDto) {
    const user = await this.usersService.login(dto);
    user.token = await this.genToken(user);
    return user;
  }

  // 生成token
  private async genToken(user: UserModel): Promise<string> {
    return await this.jwtService.signAsync({
      username: user.email,
      sub: user.id,
    });
  }

  // 验证用户是否存在
  async validateUser(id: number) {
    const key = `auth_user_${id}`;
    let authUser: any = await this.cacheMgr.get<any>(key);
    if (!authUser) {
      authUser = await this.usersService.findUserById(id);
      this.cacheMgr.set(key, authUser, 3 * MINUTES_TO_MS); // 3 minutes
    }
    return authUser;
  }
}
