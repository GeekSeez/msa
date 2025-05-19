import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RequestEntity, RequestDocument } from "./request.schema";
import { REQUEST_STATUS } from "../common/constants";
import { EventService } from "../events/event.service";
import { RewardService } from "../rewards/reward.service";

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(RequestEntity.name)
    private requestModel: Model<RequestDocument>,
    private readonly eventService: EventService,
    private readonly rewardService: RewardService
  ) {}

  async create(eventId: string, userId: string): Promise<RequestEntity> {
    const existing = await this.requestModel
      .findOne({ eventId, userId })
      .exec();
    if (existing) {
      throw new ConflictException("이미 요청된 보상입니다.");
    }
    await this.eventService.findOne(eventId);
    const created = new this.requestModel({
      eventId: new Types.ObjectId(eventId),
      userId,
      status: REQUEST_STATUS.PENDING,
    });
    return created.save();
  }

  async findAll(auditor: boolean, query: any): Promise<RequestEntity[]> {
    if (auditor) {
      return this.requestModel.find(query).exec();
    }
    if (query.userId) {
      return this.requestModel.find({ userId: query.userId }).exec();
    }
    return [];
  }

  async approve(id: string): Promise<RequestEntity> {
    const req = await this.requestModel.findById(id).exec();
    if (!req) throw new NotFoundException("보상 요청을 찾을 수 없습니다.");
    req.status = REQUEST_STATUS.APPROVED;
    return req.save();
  }

  async reject(id: string, reason: string): Promise<RequestEntity> {
    const req = await this.requestModel.findById(id).exec();
    if (!req) throw new NotFoundException("보상 요청을 찾을 수 없습니다.");
    req.status = REQUEST_STATUS.REJECTED;
    req.reason = reason;
    return req.save();
  }
}
