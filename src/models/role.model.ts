import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { PermissionModel } from "./permission.model";
import { RolePermissionModel } from "./role-permission.model";

@Table({
  tableName: "roles",
  timestamps: false,
})
export class RoleModel extends Model<RoleModel> {
  @ApiProperty({ description: "角色表ID" })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ApiProperty({ description: "角色名称" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role_name: string;

  @ApiProperty({ description: "角色描述" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role_desc: string;

  @ApiProperty({ description: "角色拥有的权限ID数组" })
  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  permissions: PermissionModel[];

  // 不用通过角色查询用户, 所以不需要在 roleModel中与 userModel 的定义多对多关系
  // 只有需要通过角色查询用户的时候才需要定义
  // @BelongsToMany(() => UserModel, () => UserRoleModel)
  // users: UserModel[];
}
