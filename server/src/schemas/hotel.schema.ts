import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum HotelStatus {
  PENDING = 'PENDING',     // Chờ Admin duyệt
  APPROVED = 'APPROVED',   // Đã duyệt (hiển thị lên web)
  REJECTED = 'REJECTED',   // Từ chối
}

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 5 })
  starRating: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ default: 0 })
  minPrice: number;

  @Prop({ type: String, enum: HotelStatus, default: HotelStatus.PENDING })
  status: HotelStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);