import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PaginateDataDto } from "src/common/dto/paginate-data.dto";
import { getTree } from "src/common/utils/getTree";
import { PermissionModel } from "src/models/permission.model";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { SearchPermissionDto } from "./dto/search-permission.dto";
import { Op } from "sequelize";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(PermissionModel)
    private readonly permissionModel: typeof PermissionModel
  ) {}

  // 创建权限
  async create(createDto: CreatePermissionDto) {
    return await this.permissionModel.create(createDto);
  }

  // 获取权限列表(分页)
  async getPermissions({ page, size }: PaginateDataDto, { type, desc }: SearchPermissionDto) {
    const where: { type?: number; desc?: object } = {};
    if (Number.isSafeInteger(type)) {
      where.type = type;
    }
    if (desc) {
      where.desc = { [Op.like]: `%${desc}%` };
    }
    return await this.permissionModel.findAndCountAll({
      offset: size * (page - 1),
      limit: size,
      where,
    });
  }

  // 获取权限列表(不分页->无限分类->树形数据)
  async getPermissionTree() {
    const rows = await this.permissionModel.findAll({ raw: true });
    return getTree(rows);
  }

  // 修改权限信息
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionModel.update(updatePermissionDto, {
      where: { id },
    });
  }

  // 删除权限信息
  async remove(id: number) {
    return await this.permissionModel.destroy({
      where: { id },
    });
  }
}
