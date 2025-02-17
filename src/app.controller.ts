import { Controller, Get } from "@nestjs/common";
import { SkipRbac, SkipAuth } from "./auth/decorators/skip-auth.decorator";

@Controller()
export class AppController {
  @SkipAuth()
  @SkipRbac()
  @Get("/ping")
  pong(): string {
    return "pong";
  }
}
