import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { UserModel } from "src/models/user.model";
import { AuthService } from "./auth.service";
import { SkipAuth, SkipRbac } from "./decorators/skip-auth.decorator";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @SkipRbac()
  @Post("/login")
  @ApiOperation({ summary: "登录" })
  @ApiResponse({ status: 200, description: "登录成功", type: UserModel })
  async login(@Body() lgoinUser: LoginUserDto) {
    return await this.authService.login(lgoinUser);
  }

  @SkipAuth()
  @SkipRbac()
  @Post("/refresh_access_token")
  @ApiOperation({ summary: "根据 refresh_token 重新生成 access_token " })
  @ApiParam({ name: "refresh_token", description: "登录接口响应的refresh_token", example: "mock-refresh-token-string" })
  @ApiResponse({ status: 200, description: "刷新成功", example: "mock-renew-access-token-string" })
  refreshToken(@Body("refresh_token") refreshToken: string) {
    return this.authService.renewAccessToken(refreshToken);
  }
}
