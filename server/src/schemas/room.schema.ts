import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  pricePerNight: number;

  @Prop({ required: true, default: 2 })
  capacity: number;

  @Prop({ required: true, default: 5 })
  totalRooms: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ default: '' })
  image: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);