import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsModule } from "./events/event.module";
import { RewardsModule } from "./rewards/reward.module";
import { RequestsModule } from "./requests/request.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
    EventsModule,
    RewardsModule,
    RequestsModule,
  ],
})
export class AppModule {}
