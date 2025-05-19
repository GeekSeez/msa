import { Controller, Post, Body, UseGuards, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "../common/dto/create-user.dto";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get(":username")
  async findOne(@Param("username") username: string) {
    return this.userService.findByUsername(username);
  }
}
