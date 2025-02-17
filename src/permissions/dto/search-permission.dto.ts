import { IsIn, MaxLength, ValidateIf } from "class-validator";

export class SearchPermissionDto {
  @IsIn([1, 2, 3], { message: "搜索类型有误" })
  type: number;

  @ValidateIf((o) => o.type)
  @MaxLength(16, { message: "搜索关键字太长" })
  desc: string;
}
