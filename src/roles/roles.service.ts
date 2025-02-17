import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PermissionModel } from "src/models/permission.model";
import { RolePermissionModel } from "src/models/role-permission.model";
import { RoleModel } from "src/models/role.model";
import { UserRoleModel } from "src/models/user-role.model";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,

    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,

    @InjectModel(RolePermissionModel)
    private readonly rolePermissionModel: typeof RolePermissionModel
  ) {}

  // 创建角色
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }

  // 查询所有角色
  async findAll() {
    return await this.roleModel.findAll({
      include: {
        model: PermissionModel,
        through: { attributes: [] },
        attributes: ["id", "desc", "pid", "type"],
      },
    });
  }

  // 更新角色信息
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleModel.update(updateRoleDto, {
      where: { id },
    });
  }

  // 删除角色信息
  async remove(id: number) {
    return this.rolePermissionModel.sequelize.transaction(async (transaction) => {
      await this.roleModel.destroy({
        where: { id },
        transaction,
      });
      await this.userRoleModel.destroy({
        where: { role_id: id },
        transaction,
      });
      await this.rolePermissionModel.destroy({
        where: { role_id: id },
        transaction,
      });
    });
  }

  // 给角色分配权限
  async assignPermissions({ role_id, permission_ids }: AssignPermissionsDto) {
    return await this.rolePermissionModel.sequelize.transaction(async (transaction) => {
      await this.rolePermissionModel.destroy({
        where: { role_id },
        transaction,
      });
      const rows = permission_ids.map((id: number) => ({
        role_id,
        permission_id: id,
      }));
      await this.rolePermissionModel.bulkCreate(rows, {
        transaction,
      });
    });
  }
}
