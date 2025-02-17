import { IsAscii, IsEmail, IsOptional, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @MinLength(2, { message: "至少2个字符" })
  username: string;

  @IsEmail({}, { message: "邮箱格式有误" })
  email: string;

  @MaxLength(16, { message: "密码必须6-16位字符" })
  @MinLength(6, { message: "密码最少6位字符" })
  @IsAscii({ message: "密码中有未知字符" })
  password: string;

  @IsOptional()
  @IsUrl({}, { message: "头像url格式有误" })
  avatar?: string;
}
