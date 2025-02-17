import { Request } from "express";
import { AuthService } from "./auth.service";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_SKIP_RBAC_KEY } from "./decorators/skip-auth.decorator";

@Injectable()
export class RbacAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    // 如果是有 @SkipRbac 装饰器的就不需要验证权限
    const skipRbac = this.reflector.getAllAndOverride<boolean>(IS_SKIP_RBAC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipRbac) {
      return true;
    }

    // 如果是需要验证rbac: 先验证是否登录, 获取登录信息
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return false;
    }
    return this.authService.hasPermissions(request);
  }
}
