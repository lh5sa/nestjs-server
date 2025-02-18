import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, Table, DataType, ForeignKey } from "sequelize-typescript";
import { RoleModel } from "./role.model";
import { UserModel } from "./user.model";

@Table({
  tableName: "user_role",
  timestamps: false,
})
export class UserRoleModel extends Model<UserRoleModel> {
  @ApiProperty({ description: "用户角色中间表id" })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ApiProperty({ description: "用户表id" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => UserModel)
  user_id: number;

  @ApiProperty({ description: "角色表id" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => RoleModel)
  role_id: number;
}
