import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { Roles } from "../common/guards/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(RolesGuard)
  @Roles("OPERATOR", "ADMIN")
  @Post()
  async create(@Body() body: any) {
    return this.eventService.create(body);
  }

  @UseGuards(RolesGuard)
  @Roles("USER", "OPERATOR", "ADMIN", "AUDITOR")
  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles("USER", "OPERATOR", "ADMIN", "AUDITOR")
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
  }
}
