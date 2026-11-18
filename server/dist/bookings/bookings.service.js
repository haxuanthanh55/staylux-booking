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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../schemas/booking.schema");
const room_schema_1 = require("../schemas/room.schema");
const hotel_schema_1 = require("../schemas/hotel.schema");
const user_schema_1 = require("../schemas/user.schema");
const events_gateway_1 = require("../events.gateway");
const redis_mail_service_1 = require("../common/redis-mail.service");
let BookingsService = class BookingsService {
    bookingModel;
    roomModel;
    hotelModel;
    userModel;
    eventsGateway;
    redisMailService;
    constructor(bookingModel, roomModel, hotelModel, userModel, eventsGateway, redisMailService) {
        this.bookingModel = bookingModel;
        this.roomModel = roomModel;
        this.hotelModel = hotelModel;
        this.userModel = userModel;
        this.eventsGateway = eventsGateway;
        this.redisMailService = redisMailService;
    }
    async createBooking(userId, body) {
        const room = await this.roomModel.findById(body.roomId);
        if (!room)
            throw new common_1.NotFoundException('Không tìm thấy hạng phòng');
        const activeBookings = await this.bookingModel.find({
            roomId: room._id,
            status: { $in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        });
        const bookedCount = activeBookings.reduce((sum, b) => sum + (b.roomCount || 0), 0);
        const available = Math.max(0, room.totalRooms - bookedCount);
        const roomCount = Number(body.roomCount || 1);
        if (roomCount > available) {
            throw new common_1.BadRequestException(`Hạng phòng này chỉ còn trống ${available} phòng!`);
        }
        const user = await this.userModel.findById(userId);
        const guestEmail = body.guestEmail || user?.email || '';
        const checkInDate = new Date(body.checkIn);
        const checkOutDate = new Date(body.checkOut);
        const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
        const totalPrice = nights * room.pricePerNight * roomCount;
        const paymentMethod = body.paymentMethod || booking_schema_1.PaymentMethod.CASH_AT_HOTEL;
        const paymentStatus = paymentMethod === booking_schema_1.PaymentMethod.CASH_AT_HOTEL ? 'THANH_TOAN_TAI_KS' : 'DA_THANH_TOAN';
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
            status: booking_schema_1.BookingStatus.PENDING,
        });
        const populated = await this.bookingModel
            .findById(booking._id)
            .populate('hotelId', 'name city address')
            .populate('roomId', 'name pricePerNight');
        await this.redisMailService.sendBookingConfirmationEmail(guestEmail, populated);
        this.eventsGateway.notifyNewBooking(populated);
        return populated;
    }
    async findUserBookings(userId) {
        return this.bookingModel
            .find({ userId })
            .populate('hotelId', 'name city address images')
            .populate('roomId', 'name pricePerNight image')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findPartnerBookings(ownerId) {
        const myHotels = await this.hotelModel.find({ ownerId }).select('_id');
        const hotelIds = myHotels.map((h) => h._id);
        return this.bookingModel
            .find({ hotelId: { $in: hotelIds } })
            .populate('hotelId', 'name city')
            .populate('roomId', 'name pricePerNight')
            .sort({ createdAt: -1 })
            .exec();
    }
    async updateStatus(bookingId, status) {
        const updated = await this.bookingModel
            .findByIdAndUpdate(bookingId, { status }, { new: true })
            .populate('hotelId', 'name city')
            .populate('roomId', 'name pricePerNight');
        this.eventsGateway.notifyStatusChanged(updated);
        return updated;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __param(2, (0, mongoose_1.InjectModel)(hotel_schema_1.Hotel.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        events_gateway_1.EventsGateway,
        redis_mail_service_1.RedisMailService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map