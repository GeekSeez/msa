import { Controller, Post, Body, Req, UseGuards, Get } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { Roles } from "../auth/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post("register")
  async register(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post("http://auth-server:3001/auth/register", body)
    );
    return response.data;
  }

  @Post("login")
  async login(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post("http://auth-server:3001/auth/login", body)
    );
    return response.data;
  }

  @UseGuards()
  @Get("me")
  async me(@Req() req: Request) {
    return req.user;
  }
}
