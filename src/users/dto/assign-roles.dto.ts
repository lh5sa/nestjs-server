import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AssignRolesDto {
  @ApiProperty({ description: "用户ID" })
  @IsNotEmpty({ message: "用户ID不能为空" })
  user_id: number;

  @ApiProperty({ description: "角色ID数组" })
  @IsNotEmpty({ message: "角色ID不能为空" })
  role_ids: number[];
}
