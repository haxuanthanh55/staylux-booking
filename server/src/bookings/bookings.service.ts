import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingStatus, PaymentMethod } from '../schemas/booking.schema';
import { Room } from '../schemas/room.schema';
import { Hotel } from '../schemas/hotel.schema';
import { User } from '../schemas/user.schema';
import { EventsGateway } from '../events.gateway';
import { RedisMailService } from '../common/redis-mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(User.name) private userModel: Model<User>,
    private eventsGateway: EventsGateway,
    private redisMailService: RedisMailService,
  ) {}

  async createBooking(userId: string, body: any) {
    const room: any = await this.roomModel.findById(body.roomId);
    if (!room) throw new NotFoundException('Không tìm thấy hạng phòng');

    const activeBookings: any[] = await this.bookingModel.find({
      roomId: room._id,
      status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] } as any,
    });
    const bookedCount = activeBookings.reduce((sum, b) => sum + (b.roomCount || 0), 0);
    const available = Math.max(0, room.totalRooms - bookedCount);
    const roomCount = Number(body.roomCount || 1);

    if (roomCount > available) {
      throw new BadRequestException(`Hạng phòng này chỉ còn trống ${available} phòng!`);
    }

    const user = await this.userModel.findById(userId);
    const guestEmail = body.guestEmail || user?.email || '';

    const checkInDate = new Date(body.checkIn);
    const checkOutDate = new Date(body.checkOut);
    const nights = Math.max(
      1,
      Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const totalPrice = nights * room.pricePerNight * roomCount;

    const paymentMethod = body.paymentMethod || PaymentMethod.CASH_AT_HOTEL;
    const paymentStatus =
      paymentMethod === PaymentMethod.CASH_AT_HOTEL ? 'THANH_TOAN_TAI_KS' : 'DA_THANH_TOAN';

    const booking = await this.bookingModel.create({
      userId,
      hotelId: room.hotelId,
      roomId: room._id,
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomCount,
      totalPrice,
      paymentMethod,
      paymentStatus,
      status: BookingStatus.PENDING,
    });

    const populated = await this.bookingModel
      .findById(booking._id)
      .populate('hotelId', 'name city address')
      .populate('roomId', 'name pricePerNight');

    await this.redisMailService.sendBookingConfirmationEmail(guestEmail, populated);

    this.eventsGateway.notifyNewBooking(populated);
    return populated;
  }

  async findUserBookings(userId: string) {
    return this.bookingModel
      .find({ userId })
      .populate('hotelId', 'name city address images')
      .populate('roomId', 'name pricePerNight image')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPartnerBookings(ownerId: string) {
    const myHotels = await this.hotelModel.find({ ownerId }).select('_id');
    const hotelIds = myHotels.map((h) => h._id);

    return this.bookingModel
      .find({ hotelId: { $in: hotelIds } as any })
      .populate('hotelId', 'name city')
      .populate('roomId', 'name pricePerNight')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    const updated = await this.bookingModel
      .findByIdAndUpdate(bookingId, { status }, { new: true })
      .populate('hotelId', 'name city')
      .populate('roomId', 'name pricePerNight');

    this.eventsGateway.notifyStatusChanged(updated);
    return updated;
  }
}