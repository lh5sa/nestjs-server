import { Table, Column, DataType, Model, BelongsToMany } from "sequelize-typescript";
import * as bcryptjs from "bcryptjs";
import { RoleModel } from "./role.model";
import { UserRoleModel } from "./user-role.model";
import { PermissionModel } from "./permission.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({
  tableName: "users",
  createdAt: "created_at",
  updatedAt: false,
  defaultScope: {
    attributes: { exclude: ["password"] },
  },
})
export class UserModel extends Model<UserModel> {
  @ApiProperty({ description: "用户ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ description: "用户名" })
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @ApiProperty({ description: "用户头像url" })
  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @ApiProperty({ description: "用户邮箱" })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty({ description: "密码" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string) {
      // 将密码原文计算 hash 后存入数据库
      const hash = bcryptjs.hashSync(value, 10);
      this.setDataValue("password", hash);
    },
  })
  password: string;

  @ApiProperty({ description: "状态(1:正常 0:锁定)" })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  status: number;

  @ApiProperty({ description: "创建时间" })
  @Column({ type: DataType.DATE, allowNull: true })
  created_at: string;

  // 登录时的 access_token
  @ApiProperty({ description: "access_token" })
  @Column({ type: DataType.VIRTUAL })
  access_token?: string;

  // 刷新时的 refresh_token
  @ApiProperty({ description: "refresh_token" })
  @Column({ type: DataType.VIRTUAL })
  refresh_token?: string;

  // 用户的所有权限
  @ApiProperty({ description: "用户权限", type: [PermissionModel] })
  permissions?: PermissionModel[];

  // 用户的角色: 定义用户表和角色表的关联关系
  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  roles: RoleModel[];
}
