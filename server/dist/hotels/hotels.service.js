"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hotel_schema_1 = require("../schemas/hotel.schema");
const room_schema_1 = require("../schemas/room.schema");
const booking_schema_1 = require("../schemas/booking.schema");
const user_schema_1 = require("../schemas/user.schema");
const redis_mail_service_1 = require("../common/redis-mail.service");
let HotelsService = class HotelsService {
    hotelModel;
    roomModel;
    bookingModel;
    userModel;
    redisMailService;
    constructor(hotelModel, roomModel, bookingModel, userModel, redisMailService) {
        this.hotelModel = hotelModel;
        this.roomModel = roomModel;
        this.bookingModel = bookingModel;
        this.userModel = userModel;
        this.redisMailService = redisMailService;
    }
    async findAllPublic(query) {
        const cacheKey = `hotels:public:${JSON.stringify(query)}`;
        const cached = await this.redisMailService.getKey(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const filter = { status: hotel_schema_1.HotelStatus.APPROVED };
        if (query.city)
            filter.city = { $regex: query.city, $options: 'i' };
        if (query.keyword) {
            filter.$or = [
                { name: { $regex: query.keyword, $options: 'i' } },
                { address: { $regex: query.keyword, $options: 'i' } },
            ];
        }
        if (query.maxPrice)
            filter.minPrice = { $lte: Number(query.maxPrice) };
        if (query.starRating)
            filter.starRating = Number(query.starRating);
        const hotels = await this.hotelModel.find(filter).sort({ createdAt: -1 }).lean();
        const activeBookings = await this.bookingModel.find({
            status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        }).lean();
        const allRooms = await this.roomModel.find().lean();
        const enrichedHotels = hotels.map((hotel) => {
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
    async findOneWithRooms(id) {
        const hotel = await this.hotelModel.findById(id).lean();
        if (!hotel)
            throw new common_1.NotFoundException('Không tìm thấy khách sạn');
        const rooms = await this.roomModel.find({ hotelId: hotel._id }).lean();
        const activeBookings = await this.bookingModel.find({
            hotelId: hotel._id,
            status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        }).lean();
        const roomsWithAvailability = rooms.map((room) => {
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
    async findPartnerHotels(ownerId) {
        const hotels = await this.hotelModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
        const result = [];
        for (const h of hotels) {
            const rooms = await this.roomModel.find({ hotelId: h._id }).lean();
            result.push({ ...h, rooms });
        }
        return result;
    }
    async createHotel(ownerId, body) {
        return this.hotelModel.create({
            ...body,
            ownerId,
            status: hotel_schema_1.HotelStatus.PENDING,
        });
    }
    async createRoom(hotelId, body) {
        const room = await this.roomModel.create({ ...body, hotelId });
        const rooms = await this.roomModel.find({ hotelId });
        const minPrice = Math.min(...rooms.map((r) => r.pricePerNight));
        await this.hotelModel.findByIdAndUpdate(hotelId, { minPrice });
        return room;
    }
    async deleteRoom(roomId) {
        return this.roomModel.findByIdAndDelete(roomId);
    }
    async findAllForAdmin() {
        return this.hotelModel.find().populate('ownerId', 'fullName email phone').sort({ createdAt: -1 }).exec();
    }
    async updateHotelStatus(hotelId, status) {
        return this.hotelModel.findByIdAndUpdate(hotelId, { status }, { new: true });
    }
    async findAllUsers() {
        return this.userModel.find().select('-password').sort({ createdAt: -1 }).exec();
    }
    async toggleUserActive(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        user.isActive = !user.isActive;
        return user.save();
    }
    async getDashboardStats() {
        const [totalUsers, totalHotels, pendingHotels, bookings] = await Promise.all([
            this.userModel.countDocuments(),
            this.hotelModel.countDocuments({ status: hotel_schema_1.HotelStatus.APPROVED }),
            this.hotelModel.countDocuments({ status: hotel_schema_1.HotelStatus.PENDING }),
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
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(hotel_schema_1.Hotel.name)),
    __param(1, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __param(2, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        redis_mail_service_1.RedisMailService])
], HotelsService);
//# sourceMappingURL=hotels.service.js.map