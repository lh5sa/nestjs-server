import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SkipAuth, SkipRbac } from "./decorators/skip-auth.decorator";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @SkipRbac()
  @Post("/login")
  async login(@Body() lgoinUser: LoginUserDto) {
    return await this.authService.login(lgoinUser);
  }

  @SkipAuth()
  @SkipRbac()
  @Post("/refresh_access_token")
  refreshToken(@Body("refresh_token") refreshToken: string) {
    return this.authService.renewAccessToken(refreshToken);
  }
}
