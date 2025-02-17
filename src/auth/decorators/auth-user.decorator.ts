import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// 参数装饰器, 获取到验证后的用户信息
export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
