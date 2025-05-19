import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestEntity, RequestSchema } from "./request.schema";
import { RequestService } from "./request.service";
import { RequestController } from "./request.controller";
import { EventsModule } from "../events/event.module";
import { RewardsModule } from "../rewards/reward.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestEntity.name, schema: RequestSchema },
    ]),
    EventsModule,
    RewardsModule,
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestsModule {}
