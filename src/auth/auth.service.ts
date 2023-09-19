import { Request } from 'express';
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

  // 验证是否有权限
  async hasPermissions(request: Request): Promise<boolean> {
    const check = (path: string, url: string, method: string, id: string) => {
      method = method.toUpperCase();
      const allowMethods = ['GET', 'POST', 'PATCH', 'DELETE'];
      if (!allowMethods.includes(method)) {
        return false;
      }
      if (method === 'PATCH' || method === 'DELETE') {
        path = path.replace(':id', id);
      }
      return path === url;
    };

    const authUser = <UserModel>request.user;
    const paramId = request.params.id;
    const permissions = await this.getAuthUserPerms(authUser);
    for (const item of permissions) {
      if (check(item.path, request.path, request.method, paramId)) {
        return true;
      }
    }
    return false;
  }

  // 获取登录用户的所有权限(缓存)
  async getAuthUserPerms(user: UserModel) {
    const key = `auth_user_perms_${user.id}`;
    let permissions: any = await this.cacheMgr.get(key);
    if (!permissions) {
      permissions = await this.usersService.getPermsByUserId(user.id);
      this.cacheMgr.set(key, permissions, 10 * MINUTES_TO_MS); // 10 minus
    }
    return permissions;
  }
}
