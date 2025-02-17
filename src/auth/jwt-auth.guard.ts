import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_SKIP_AUTH_KEY } from "./decorators/skip-auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt-auth") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 如果是有 @SkipAuth 装饰器的就不需要验证登录状态就能直接访问的接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
