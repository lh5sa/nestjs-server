import { IsNotEmpty } from 'class-validator';

export class AssignRolesDto {
  @IsNotEmpty({ message: '用户ID不能为空' })
  user_id: number;

  // TODO: 验证必须是一个数字数组
  @IsNotEmpty({ message: '角色ID不能为空' })
  role_ids: number[];
}
