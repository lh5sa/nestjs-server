import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateRoleDto {
  @MaxLength(20, { message: "角色名太长" })
  @IsNotEmpty()
  role_name: string;

  @MaxLength(60, { message: "角色描述太长" })
  @IsNotEmpty()
  role_desc: string;
}
