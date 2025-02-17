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
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  type: number;

  @Column({ type: DataType.STRING, allowNull: false })
  desc: string;

  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue("method", value.toUpperCase());
    },
  })
  method: string;

  @Column({ type: DataType.STRING })
  icon: string;

  @Column({ type: DataType.STRING })
  path: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  })
  status: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  })
  pid: number;
}
