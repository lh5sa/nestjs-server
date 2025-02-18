import { ApiProperty } from "@nestjs/swagger";
import { IsAscii, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({ description: "原密码" })
  @MaxLength(16, { message: "原密码不正确" })
  @MinLength(6, { message: "原密码不正确" })
  @IsAscii({ message: "旧密码不正确" })
  old_password: string;

  @ApiProperty({ description: "新密码" })
  @ApiProperty({ description: "搜索内容" })
  @MaxLength(16, { message: "密码必须6-16位字符" })
  @MinLength(6, { message: "密码最少6位字符" })
  @IsAscii({ message: "密码中有未知字符" })
  new_password: string;
}
