import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH_AT_HOTEL = 'CASH_AT_HOTEL', // Thanh toán tại khách sạn
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản QR ngân hàng
  VNPAY_WALLET = 'VNPAY_WALLET',   // Ví điện tử / Thẻ
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ required: true })
  guestName: string;

  @Prop({ required: true })
  guestPhone: string;

  @Prop({ default: '' })
  guestEmail: string;

  @Prop({ required: true })
  checkIn: Date;

  @Prop({ required: true })
  checkOut: Date;

  @Prop({ required: true, default: 1 })
  roomCount: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.CASH_AT_HOTEL })
  paymentMethod: PaymentMethod;

  @Prop({ default: 'PAID' })
  paymentStatus: string;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);