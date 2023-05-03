import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserModel } from 'src/models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) public userModel: typeof UserModel, private jwtService: JwtService) {}

  // 第二步: 登录并且返回 token
  async login({ email, password }: LoginUserDto) {
    const user = await this.userModel.findOne({
      attributes: {
        include: ['password'],
      },
      where: {
        email,
      },
      raw: true,
    });
    if (!user) {
      throw new UnauthorizedException('用户名或密码有误');
    }
    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      throw new UnauthorizedException('用户名或密码有误');
    }
    user.token = await this.genToken(user);
    delete user.password;
    return user;
  }

  private async genToken(user: UserModel): Promise<string> {
    return await this.jwtService.signAsync({
      username: user.email,
      sub: user.id,
    });
  }

  async getUsers() {
    return await this.userModel.findAll();
  }

  async validateUser(id: number) {
    return await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });
  }
}
