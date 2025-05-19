import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: "Event", required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  quantity: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
