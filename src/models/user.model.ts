import { Table, Column, DataType, Model, BelongsToMany } from "sequelize-typescript";
import * as bcryptjs from "bcryptjs";
import { RoleModel } from "./role.model";
import { UserRoleModel } from "./user-role.model";
import { PermissionModel } from "./permission.model";

@Table({
  tableName: "users",
  createdAt: "created_at",
  updatedAt: false,
  defaultScope: {
    attributes: { exclude: ["password"] },
  },
})
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  status: number;

  @Column({ type: DataType.DATE, allowNull: true })
  created_at: string;

  // 登录时的 access_token
  @Column({ type: DataType.VIRTUAL })
  access_token?: string;

  // 刷新时的 refresh_token
  @Column({ type: DataType.VIRTUAL })
  refresh_token?: string;

  // 登录时需要的权限
  permissions?: PermissionModel[];

  // 定义关系
  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  roles: RoleModel[];
}
