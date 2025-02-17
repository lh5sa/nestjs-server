import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import * as bcrypt from "bcryptjs";
import { PaginateDataDto } from "src/common/dto/paginate-data.dto";
import { PermissionModel } from "src/models/permission.model";
import { RoleModel } from "src/models/role.model";
import { UserRoleModel } from "src/models/user-role.model";
import { UserModel } from "src/models/user.model";
import { AssignRolesDto } from "./dto/assign-roles.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";
import { LoginUserDto } from "src/auth/dto/login-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    @InjectModel(RoleModel) private readonly roleModel: typeof RoleModel
  ) {}

  // 登录
  async login({ email, password }: LoginUserDto): Promise<UserModel> {
    const user = await this.userModel.findOne({
      attributes: { include: ["password"] },
      where: { email },
      raw: true,
    });
    if (!user) {
      throw new UnauthorizedException("用户名或密码有误");
    }
    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      throw new UnauthorizedException("用户名或密码有误");
    }
    delete user.password;

    // 登录时需要查询用户所有的权限
    user.permissions = await this.getPermsByUserId(user.id, true);
    return user;
  }

  // 根据用户ID查询出当前用户所有的权限
  async getPermsByUserId(id: number, onlyRoute = false): Promise<PermissionModel[]> {
    // 1. 查出用户所有的角色
    const userRoles = await this.userRoleModel.findAll({
      where: { user_id: id },
    });
    if (userRoles.length === 0) {
      return [];
    }
    // 2. 根据用户所有的角色查询出所有的权限
    const roleIds = userRoles.map((item) => item.role_id);
    const roles = await this.roleModel.findAll({
      where: {
        id: { [Op.in]: roleIds },
      },
      include: {
        model: PermissionModel,
        through: {
          attributes: [],
        },
        where: onlyRoute ? { type: 0 } : {},
      },
    });
    if (roles.length === 0) {
      return [];
    }

    // 3.只需要权限,过滤数据
    const permissions = [];
    for (const item of roles) {
      permissions.push(...item.permissions);
    }
    return permissions;
  }

  // 根据ID查询用户
  async findUserById(id: number): Promise<UserModel> {
    return await this.userModel.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      raw: true,
    });
  }

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
    options: { getRoles: boolean; getPermissions?: boolean } = {
      getRoles: false,
      getPermissions: false,
    }
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
      attributes: { include: ["password"] },
    });
    const isValidPassword = await bcrypt.compare(old_password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException("原密码有误");
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
