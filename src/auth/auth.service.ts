import { Request } from "express";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserModel } from "src/models/user.model";

const MINUTES_TO_MS = 60000; // 6 * 1000

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheMgr: Cache,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  // 登录
  async login(dto: LoginUserDto) {
    const user = await this.usersService.login(dto);
    const payload = {
      username: user.email,
      sub: user.id, // sub 表示用户 id, 需要根据这个字段去查询用户是否存在
    };
    user.access_token = this.genAccessToken(payload);
    user.refresh_token = this.genRefreshToken(payload);
    return user;
  }

  // 生成 access_token
  public genAccessToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  // 生成 refresh_token
  public genRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, this.configService.get("jwt.refreshTokenOptions"));
  }

  // 根据 refresh_token 获取新的 access_token
  public renewAccessToken(refreshToken: string) {
    try {
      // 根据配置中的 secret 去验证传入的 refresh_token
      const { sub, username } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("jwt.refreshTokenOptions.secret"),
      });

      // 通过验证就生成一个行的 access_token
      return this.genAccessToken({ sub, username });
    } catch (e) {
      // 如果不通过验证, 说明 refresh_token 过期/有误, 应该重新登录
      throw new UnauthorizedException();
    }
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
    const authUser = <UserModel>request.user;
    const paramId = request.params.id;
    const permissions = await this.getAuthUserPerms(authUser);
    for (const item of permissions) {
      if (this.check(item.path, request.path, request.method, paramId)) {
        return true;
      }
    }
    return false;
  }

  // 检查权限
  private check(path: string, url: string, method: string, id: string) {
    const _method = method.toUpperCase();
    const allowMethods = ["GET", "POST", "PATCH", "DELETE"];
    if (!allowMethods.includes(_method)) {
      return false;
    }
    let _path = path;
    if (_method === "PATCH" || _method === "DELETE") {
      _path = _path.replace(":id", id);
    }
    return _path === url;
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
