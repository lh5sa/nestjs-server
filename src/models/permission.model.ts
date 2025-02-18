import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "permissions",
  timestamps: false,
  scopes: {
    active: {
      where: {
        status: 0,
      },
    },
  },
})
export class PermissionModel extends Model<PermissionModel> {
  @ApiProperty({ description: "权限id" })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ApiProperty({ description: "权限类型(菜单权限/api权限)" })
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  type: number;

  @ApiProperty({ description: "权限权限描述" })
  @Column({ type: DataType.STRING, allowNull: false })
  desc: string;

  @ApiProperty({ description: "权限请求方式(get/post等)" })
  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue("method", value.toUpperCase());
    },
  })
  method: string;

  @ApiProperty({ description: "权限图标(如果是菜单权限)" })
  @Column({ type: DataType.STRING })
  icon: string;

  @ApiProperty({ description: "权限路径" })
  @Column({ type: DataType.STRING })
  path: string;

  @ApiProperty({ description: "权限状态" })
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  })
  status: number;

  @ApiProperty({ description: "权限父id" })
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  })
  pid: number;
}
