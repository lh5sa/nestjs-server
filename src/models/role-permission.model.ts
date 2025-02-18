import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table, DataType, ForeignKey } from "sequelize-typescript";
import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";

@Table({
  tableName: "role_permission",
  timestamps: false,
})
export class RolePermissionModel extends Model<RolePermissionModel> {
  @ApiProperty({ description: "角色权限中间表ID" })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ApiProperty({ description: "权限表ID" })
  @ForeignKey(() => PermissionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  permission_id: number;

  @ApiProperty({ description: "角色表ID" })
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;
}
