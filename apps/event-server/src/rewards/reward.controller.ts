import { Controller, Post, Body, Param, UseGuards, Get } from "@nestjs/common";
import { RewardService } from "./reward.service";
import { Roles } from "../common/guards/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("events/:eventId/rewards")
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @UseGuards(RolesGuard)
  @Roles("OPERATOR", "ADMIN")
  @Post()
  async create(@Param("eventId") eventId: string, @Body() body: any) {
    return this.rewardService.create(eventId, body);
  }

  @UseGuards(RolesGuard)
  @Roles("USER", "OPERATOR", "ADMIN", "AUDITOR")
  @Get()
  async findAll(@Param("eventId") eventId: string) {
    return this.rewardService.findAllByEvent(eventId);
  }
}
