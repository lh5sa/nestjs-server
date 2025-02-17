import { SetMetadata } from "@nestjs/common";

export const IS_SKIP_AUTH_KEY = "isSkipAuth";
export const IS_SKIP_RBAC_KEY = "isSipRbac";

// 不需要验证rbac权限
export const SkipRbac = () => SetMetadata(IS_SKIP_RBAC_KEY, true);

// 不需要验证登录
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);
