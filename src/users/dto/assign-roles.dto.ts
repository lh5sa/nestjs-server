import { IsNotEmpty } from "class-validator";

export class AssignRolesDto {
  @IsNotEmpty({ message: "用户ID不能为空" })
  user_id: number;

  @IsNotEmpty({ message: "角色ID不能为空" })
  role_ids: number[];
}
