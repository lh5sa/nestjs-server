import { Column, Model, Table, DataType, ForeignKey } from "sequelize-typescript";
import { RoleModel } from "./role.model";
import { UserModel } from "./user.model";

@Table({
  tableName: "user_role",
  timestamps: false,
})
export class UserRoleModel extends Model<UserRoleModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => UserModel)
  user_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => RoleModel)
  role_id: number;
}
