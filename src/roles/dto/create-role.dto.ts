import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ description: "角色名" })
  @MaxLength(20, { message: "角色名太长" })
  @IsNotEmpty()
  role_name: string;

  @ApiProperty({ description: "角色描述" })
  @MaxLength(60, { message: "角色描述太长" })
  @IsNotEmpty()
  role_desc: string;
}
