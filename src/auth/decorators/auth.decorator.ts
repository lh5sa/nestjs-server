import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// 这个是方便修饰某个方法或者controller, 就不用每次写
// @UseGuards(AuthGuard('jwt')) 直接用 @Auth() 就可以了,
// 但是用了 jwt-auth.guard.ts 做全局的验证处理, 就不用手动加了
// 如果某个方法不需要 jwt 验证, 可以使用 skip-auth 中的 @SkipAuth 就可以了
export const Auth = () => applyDecorators(UseGuards(AuthGuard("jwt")));
