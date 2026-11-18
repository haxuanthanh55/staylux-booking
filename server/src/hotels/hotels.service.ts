import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelStatus } from '../schemas/hotel.schema';
import { Room } from '../schemas/room.schema';
import { Booking } from '../schemas/booking.schema';
import { User } from '../schemas/user.schema';
import { RedisMailService } from '../common/redis-mail.service';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(User.name) private userModel: Model<User>,
    private redisMailService: RedisMailService,
  ) {}

  async findAllPublic(query: { city?: string; keyword?: string; maxPrice?: number; starRating?: number }) {
    const cacheKey = `hotels:public:${JSON.stringify(query)}`;
    const cached = await this.redisMailService.getKey(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const filter: any = { status: HotelStatus.APPROVED };
    if (query.city) filter.city = { $regex: query.city, $options: 'i' };
    if (query.keyword) {
      filter.$or = [
        { name: { $regex: query.keyword, $options: 'i' } },
        { address: { $regex: query.keyword, $options: 'i' } },
      ];
    }
    if (query.maxPrice) filter.minPrice = { $lte: Number(query.maxPrice) };
    if (query.starRating) filter.starRating = Number(query.starRating);

    const hotels = await this.hotelModel.find(filter).sort({ createdAt: -1 }).lean();

    // Ép kiểu as any để TS không báo lỗi $in
    const activeBookings: any[] = await this.bookingModel.find({
      status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] } as any,
    }).lean();

    const allRooms: any[] = await this.roomModel.find().lean();

    const enrichedHotels = hotels.map((hotel: any) => {
      const hotelRooms = allRooms.filter((r) => String(r.hotelId) === String(hotel._id));
      const totalRooms = hotelRooms.reduce((sum, r) => sum + (r.totalRooms || 0), 0);
      const bookedRooms = activeBookings
        .filter((b) => String(b.hotelId) === String(hotel._id))
        .reduce((sum, b) => sum + (b.roomCount || 0), 0);

      return {
        ...hotel,
        totalRooms,
        availableRooms: Math.max(0, totalRooms - bookedRooms),
      };
    });

    await this.redisMailService.setWithTTL(cacheKey, JSON.stringify(enrichedHotels), 60);
    return enrichedHotels;
  }

  async findOneWithRooms(id: string) {
    const hotel = await this.hotelModel.findById(id).lean();
    if (!hotel) throw new NotFoundException('Không tìm thấy khách sạn');
    const rooms: any[] = await this.roomModel.find({ hotelId: hotel._id }).lean();

    const activeBookings: any[] = await this.bookingModel.find({
      hotelId: hotel._id,
      status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] } as any,
    }).lean();

    const roomsWithAvailability = rooms.map((room: any) => {
      const bookedCount = activeBookings
        .filter((b) => String(b.roomId) === String(room._id))
        .reduce((sum, b) => sum + (b.roomCount || 0), 0);

      return {
        ...room,
        bookedRooms: bookedCount,
        availableRooms: Math.max(0, (room.totalRooms || 0) - bookedCount),
      };
    });

    return { hotel, rooms: roomsWithAvailability };
  }

  async findPartnerHotels(ownerId: string) {
    const hotels = await this.hotelModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
    const result = [];
    for (const h of hotels) {
      const rooms = await this.roomModel.find({ hotelId: h._id }).lean();
      result.push({ ...h, rooms });
    }
    return result;
  }

  async createHotel(ownerId: string, body: any) {
    return this.hotelModel.create({
      ...body,
      ownerId,
      status: HotelStatus.PENDING,
    });
  }

  async createRoom(hotelId: string, body: any) {
    const room = await this.roomModel.create({ ...body, hotelId });
    const rooms = await this.roomModel.find({ hotelId });
    const minPrice = Math.min(...rooms.map((r) => r.pricePerNight));
    await this.hotelModel.findByIdAndUpdate(hotelId, { minPrice });
    return room;
  }

  async deleteRoom(roomId: string) {
    return this.roomModel.findByIdAndDelete(roomId);
  }

  async findAllForAdmin() {
    return this.hotelModel.find().populate('ownerId', 'fullName email phone').sort({ createdAt: -1 }).exec();
  }

  async updateHotelStatus(hotelId: string, status: HotelStatus) {
    return this.hotelModel.findByIdAndUpdate(hotelId, { status }, { new: true });
  }

  async findAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 }).exec();
  }

  async toggleUserActive(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    user.isActive = !user.isActive;
    return user.save();
  }

  async getDashboardStats() {
    const [totalUsers, totalHotels, pendingHotels, bookings] = await Promise.all([
      this.userModel.countDocuments(),
      this.hotelModel.countDocuments({ status: HotelStatus.APPROVED }),
      this.hotelModel.countDocuments({ status: HotelStatus.PENDING }),
      this.bookingModel.find(),
    ]);
    const totalRevenue = bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalUsers,
      totalHotels,
      pendingHotels,
      totalBookings: bookings.length,
      totalRevenue,
    };
  }
}