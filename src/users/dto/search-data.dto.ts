import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

// type & content 如果有一个有值, 那么另外一个必须有值
// 要不然就两个都为空
export class SearchDataDto {
  @ApiProperty({ description: "搜索类型" })
  @IsIn([1, 2, 3], { message: "未知搜索类型" })
  type: number;

  @ApiProperty({ description: "搜索内容" })
  content?: string;
}
