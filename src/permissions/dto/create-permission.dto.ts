import { IsIn, IsInt, IsNotEmpty, MaxLength, ValidateIf } from "class-validator";

export class CreatePermissionDto {
  // type	  是	string	权限类型(0:路由权限 1:api 权限)
  // desc	  是	string	权限描述
  // pid	  是	string	权限的父级 ID(0: 顶级权限)
  // path	  否	string	权限路径
  // method	否	string	api 权限的请求方式(GET,POST 等)
  // icon	  否	string	路由权限的图标
  @MaxLength(64, { message: "权限描述太长" })
  @IsNotEmpty({ message: "权限描述不能为空" })
  desc: string;

  @IsIn([0, 1], { message: "权限类型有误" })
  type: number;

  @ValidateIf((o) => o.type === 1)
  @IsIn(["GET", "POST", "PATCH", "DELETE"], {
    message: "method只能是 get,post,patch,delete",
  })
  method: string;

  @ValidateIf((o) => o.type === 0)
  @IsNotEmpty({ message: "请选择icon" })
  icon: string;

  @MaxLength(32, { message: "路径太长" })
  @IsNotEmpty({ message: "权限path不能为空" })
  path: string;

  @IsInt({ message: "权限pid有误" })
  @IsNotEmpty({ message: "权限pid不能为空" })
  pid: number;
}
