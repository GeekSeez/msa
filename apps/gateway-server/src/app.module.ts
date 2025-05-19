import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./controllers/auth.controller";
import { EventController } from "./controllers/event.controller";
import { JwtStrategy } from "./auth/jwt.strategy";
import { RolesGuard } from "./auth/roles.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
  ],
  controllers: [AuthController, EventController],
  providers: [JwtStrategy, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
