import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { REQUEST_STATUS } from "../common/constants";

export type RequestDocument = RequestEntity & Document;

@Schema({ timestamps: true })
export class RequestEntity {
  @Prop({ type: Types.ObjectId, ref: "Event", required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({
    enum: Object.values(REQUEST_STATUS),
    default: REQUEST_STATUS.PENDING,
  })
  status: string;

  @Prop()
  reason: string;
}

export const RequestSchema = SchemaFactory.createForClass(RequestEntity);
