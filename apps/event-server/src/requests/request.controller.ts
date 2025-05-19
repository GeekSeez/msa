import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Query,
  Patch,
  Req,
} from "@nestjs/common";
import { RequestService } from "./request.service";
import { Roles } from "../common/guards/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { REQUEST_STATUS } from "../common/constants";
import { Request } from "express";

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(RolesGuard)
  @Roles("USER")
  @Post("events/:eventId/requests")
  async create(@Param("eventId") eventId: string, @Req() req: Request) {
    return this.requestService.create(eventId, (req.user as any).userId);
  }

  @UseGuards(RolesGuard)
  @Roles("USER", "AUDITOR", "OPERATOR", "ADMIN")
  @Get("requests")
  async findAll(@Query() query: any, @Req() req: Request) {
    const isAuditor = (req.user as any).roles.includes("AUDITOR");
    query.userId = isAuditor ? undefined : (req.user as any).userId;
    return this.requestService.findAll(isAuditor, query);
  }

  @UseGuards(RolesGuard)
  @Roles("OPERATOR", "ADMIN")
  @Patch("requests/:id/approve")
  async approve(@Param("id") id: string) {
    return this.requestService.approve(id);
  }

  @UseGuards(RolesGuard)
  @Roles("OPERATOR", "ADMIN")
  @Patch("requests/:id/reject")
  async reject(@Param("id") id: string, @Body("reason") reason: string) {
    return this.requestService.reject(id, reason);
  }
}
