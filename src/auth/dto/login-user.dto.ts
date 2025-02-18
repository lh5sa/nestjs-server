// import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  // @ApiProperty({ description: "邮箱账号", example: "admin@qq.com" })
  @IsEmail({}, { message: "邮箱格式有误" })
  email: string;

  // @ApiProperty({ description: "账号密码", example: "123456" })
  @MaxLength(15, { message: "密码格式有误,必须6-15位字符" })
  @MinLength(6, { message: "密码至少6位字符" })
  password: string;
}
