import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

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
    return await this.usersService.findUserById(id);
  }
}
