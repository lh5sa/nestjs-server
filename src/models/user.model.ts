import { Table, Column, DataType, Model, BelongsToMany, ForeignKey } from 'sequelize-typescript';
import * as bcryptjs from 'bcryptjs';
import { RoleModel } from './role.model';
import { UserRoleModel } from './user-role.model';

@Table({
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: false,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
})
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string) {
      // 将密码原文计算 hash 后存入数据库
      const hash = bcryptjs.hashSync(value, 10);
      this.setDataValue('password', hash);
    },
  })
  password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  status: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  created_at: string;

  @Column({
    type: DataType.VIRTUAL,
  })
  token?: string;

  // 定义关系
  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  roles: RoleModel[];
}
