import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserModel } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginateDataDto } from './dto/paginate-data.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleModel } from 'src/models/role.model';
import { PermissionModel } from 'src/models/permission.model';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRoleModel } from 'src/models/user-role.model';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(UserRoleModel) private readonly userRoleModel: typeof UserRoleModel
  ) {}

  // 创建用户信息
  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = await this.userModel.create(createUserDto);
    delete user.password;
    return user;
  }

  // 查询用户信息&角色信息&权限信息&分页
  async getUserInfos(
    { page, size }: PaginateDataDto,
    { type, content }: SearchUserDto,
    options: { getRoles: boolean; getPermissions?: boolean } = { getRoles: false, getPermissions: false }
  ): Promise<{ count: number; rows: UserModel[] }> {
    // 搜索类型: 1:用户ID 2:用户名 3:用户邮箱
    let where = {};
    switch (Number(type)) {
      case 1:
        where = { id: content };
        break;
      case 2:
        where = { username: { [Op.like]: `%${content}%` } };
        break;
      case 3:
        where = { email: { [Op.like]: `%${content}%` } };
        break;
      default:
        where = {};
        break;
    }
    const include: any = {};

    if (options.getRoles) {
      include.model = RoleModel;
      include.through = {
        attributes: [], // 去除中间表的字段
      };
      if (options.getPermissions) {
        // 嵌套连表查询: 角色多对多查询出所有的权限
        include.include = {
          model: PermissionModel,
          through: { attributes: [] },
        };
      }
    }

    return await this.userModel.findAndCountAll({
      offset: (page - 1) * size,
      limit: size,
      where,
      include,
    });
  }

  // 更新用户密码
  async updatePassword(id: number, { old_password, new_password }: UpdatePasswordDto) {
    // 需要先检查原密码
    const user = await this.userModel.findByPk(id, {
      attributes: { include: ['password'] },
    });
    const isValidPassword = await bcrypt.compare(old_password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('原密码有误');
    }
    return await this.update(id, {
      password: new_password,
    });
  }

  // 更新用户信息
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userModel.update(updateUserDto, {
      where: { id },
    });
  }

  // 移除用户信息
  async remove(id: number): Promise<number> {
    return await this.userModel.destroy({
      where: { id },
    });
  }

  // 分配角色
  async assignRoles({ user_id, role_ids }: AssignRolesDto) {
    return this.userRoleModel.sequelize.transaction(async (transaction) => {
      // 删除老的数据
      await this.userRoleModel.destroy({
        where: { user_id },
        transaction,
      });

      // 创建新的数据
      const rows = role_ids.map((id) => ({ user_id, role_id: id }));
      await this.userRoleModel.bulkCreate(rows, { transaction });
    });
  }
}
