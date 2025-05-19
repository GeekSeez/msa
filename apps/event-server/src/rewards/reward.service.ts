import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Reward, RewardDocument } from "./reward.schema";

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>
  ) {}

  async create(eventId: string, data: any): Promise<Reward> {
    const created = new this.rewardModel({
      ...data,
      eventId: new Types.ObjectId(eventId),
    });
    return created.save();
  }

  async findAllByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .exec();
  }
}
