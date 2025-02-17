import { IsInt, IsNotEmpty } from "class-validator";

export class AssignPermissionsDto {
  @IsInt({ message: "角色id必须是数字" })
  role_id: number;

  // TODO: 验证必须是一个数字数组
  @IsNotEmpty({ message: "权限id不能为空" })
  permission_ids: number[];
}
