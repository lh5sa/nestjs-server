import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class AssignPermissionsDto {
  @ApiProperty({ description: "角色id" })
  @IsInt({ message: "角色id必须是数字" })
  role_id: number;

  @ApiProperty({ description: "权限ID数组" })
  @IsNotEmpty({ message: "权限id不能为空" })
  permission_ids: number[];
}
