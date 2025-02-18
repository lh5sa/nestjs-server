import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max } from "class-validator";

export class PaginateDataDto {
  @ApiProperty({ description: "分页:页码" })
  @IsInt({ message: "分页数据 page 必须是数字" })
  @IsOptional()
  page: number;

  @ApiProperty({ description: "分页:每页多少条数据" })
  @Max(50, { message: "每页页最多50条数据" })
  @IsInt({ message: "分页数据 size 必须是数字" })
  @IsOptional()
  size: number;
}
