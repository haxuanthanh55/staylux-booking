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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const hotels_service_1 = require("./hotels/hotels.service");
const bookings_service_1 = require("./bookings/bookings.service");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const hotel_schema_1 = require("./schemas/hotel.schema");
const booking_schema_1 = require("./schemas/booking.schema");
let ApiController = class ApiController {
    hotelsService;
    bookingsService;
    constructor(hotelsService, bookingsService) {
        this.hotelsService = hotelsService;
        this.bookingsService = bookingsService;
    }
    getHotels(query) {
        return this.hotelsService.findAllPublic(query);
    }
    getHotelDetail(id) {
        return this.hotelsService.findOneWithRooms(id);
    }
    createBooking(req, body) {
        return this.bookingsService.createBooking(req.user.sub, body);
    }
    getMyBookings(req) {
        return this.bookingsService.findUserBookings(req.user.sub);
    }
    getPartnerHotels(req) {
        return this.hotelsService.findPartnerHotels(req.user.sub);
    }
    createPartnerHotel(req, body) {
        return this.hotelsService.createHotel(req.user.sub, body);
    }
    createRoom(hotelId, body) {
        return this.hotelsService.createRoom(hotelId, body);
    }
    deleteRoom(roomId) {
        return this.hotelsService.deleteRoom(roomId);
    }
    getPartnerBookings(req) {
        return this.bookingsService.findPartnerBookings(req.user.sub);
    }
    updateBookingStatus(id, status) {
        return this.bookingsService.updateStatus(id, status);
    }
    getAdminStats() {
        return this.hotelsService.getDashboardStats();
    }
    getAdminHotels() {
        return this.hotelsService.findAllForAdmin();
    }
    updateHotelStatus(id, status) {
        return this.hotelsService.updateHotelStatus(id, status);
    }
    getAdminUsers() {
        return this.hotelsService.findAllUsers();
    }
    toggleUser(id) {
        return this.hotelsService.toggleUserActive(id);
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)('hotels'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getHotels", null);
__decorate([
    (0, common_1.Get)('hotels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getHotelDetail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('bookings'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "createBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('bookings/my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('partner/hotels'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getPartnerHotels", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('partner/hotels'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "createPartnerHotel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('partner/hotels/:hotelId/rooms'),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "createRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('partner/rooms/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "deleteRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('partner/bookings'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getPartnerBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('bookings/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/hotels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getAdminHotels", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('admin/hotels/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "updateHotelStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getAdminUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('admin/users/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "toggleUser", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [hotels_service_1.HotelsService,
        bookings_service_1.BookingsService])
], ApiController);
//# sourceMappingURL=api.controller.js.map