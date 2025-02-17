import { IsIn } from "class-validator";

// type & content 如果有一个有值, 那么另外一个必须有值
// 要不然就两个都为空
export class SearchDataDto {
  @IsIn([1, 2, 3], { message: "未知搜索类型" })
  type: number;
  content?: string;
}
