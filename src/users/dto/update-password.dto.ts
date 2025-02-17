import { IsAscii, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @MaxLength(16, { message: "旧密码不正确" })
  @MinLength(6, { message: "旧密码不正确" })
  @IsAscii({ message: "旧密码不正确" })
  old_password: string;

  @MaxLength(16, { message: "密码必须6-16位字符" })
  @MinLength(6, { message: "密码最少6位字符" })
  @IsAscii({ message: "密码中有未知字符" })
  new_password: string;
}
