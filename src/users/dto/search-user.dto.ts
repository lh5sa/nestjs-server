import { IsIn, Length, ValidateIf } from 'class-validator';

// type & content 如果有一个有值, 那么另外一个必须有值
// 要不然就两个都为空
export class SearchUserDto {
  @ValidateIf((o) => o.content)
  @IsIn([1, 2, 3], { message: '未知搜索类型' })
  type: number;

  @ValidateIf((o) => o.type)
  @Length(1, 15, { message: '搜索内容必须1-15个字符' })
  content: string;
}
