import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { Roles } from "../auth/roles.decorator";

@Controller("events")
export class EventController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards()
  @Roles("OPERATOR", "ADMIN")
  @Post()
  async createEvent(@Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post("http://event-server:3002/events", body)
    );
    return response.data;
  }

  @UseGuards()
  @Get()
  async getEvents(@Query() query: any) {
    const response = await firstValueFrom(
      this.httpService.get("http://event-server:3002/events", { params: query })
    );
    return response.data;
  }

  @UseGuards()
  @Roles("OPERATOR", "ADMIN")
  @Post(":eventId/rewards")
  async createReward(@Param("eventId") eventId: string, @Body() body: any) {
    const response = await firstValueFrom(
      this.httpService.post(
        `http://event-server:3002/events/${eventId}/rewards`,
        body
      )
    );
    return response.data;
  }

  @UseGuards()
  @Get(":eventId/rewards")
  async getRewards(@Param("eventId") eventId: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://event-server:3002/events/${eventId}/rewards`)
    );
    return response.data;
  }

  @UseGuards()
  @Roles("USER")
  @Post(":eventId/requests")
  async requestReward(@Param("eventId") eventId: string, @Req() req: Request) {
    const body = { userId: (req.user as any).userId };
    const response = await firstValueFrom(
      this.httpService.post(
        `http://event-server:3002/events/${eventId}/requests`,
        body
      )
    );
    return response.data;
  }

  @UseGuards()
  @Get("requests")
  async getRequests(@Query() query: any, @Req() req: Request) {
    const isAuditor = (req.user as any).roles.includes("AUDITOR");
    const params = { ...query, auditor: isAuditor };
    const response = await firstValueFrom(
      this.httpService.get(`http://event-server:3002/requests`, { params })
    );
    return response.data;
  }
}
