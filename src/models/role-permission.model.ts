import { Column, Model, Table, DataType, ForeignKey } from "sequelize-typescript";
import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";

@Table({
  tableName: "role_permission",
  timestamps: false,
})
export class RolePermissionModel extends Model<RolePermissionModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => PermissionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  permission_id: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;
}
