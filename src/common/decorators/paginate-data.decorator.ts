import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const PaginateData = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  // 默认的分页数据
  const paginateData = {
    page: 1,
    size: 10,
  };

  const setValue = (key: string) => {
    const value = Number(request.query[key]);
    if (Number.isInteger(value)) {
      paginateData[key] = value;
    }
  };
  setValue("page");
  setValue("size");
  return paginateData;
});
