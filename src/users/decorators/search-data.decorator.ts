import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const SearchData = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { type, content } = request.query;

  return {
    type: Number(type),
    content,
  };
});
