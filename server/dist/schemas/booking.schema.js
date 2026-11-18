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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = exports.Booking = exports.PaymentMethod = exports.BookingStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CHECKED_IN"] = "CHECKED_IN";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CANCELLED"] = "CANCELLED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH_AT_HOTEL"] = "CASH_AT_HOTEL";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["VNPAY_WALLET"] = "VNPAY_WALLET";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Booking = class Booking extends mongoose_2.Document {
    userId;
    hotelId;
    roomId;
    guestName;
    guestPhone;
    guestEmail;
    checkIn;
    checkOut;
    roomCount;
    totalPrice;
    paymentMethod;
    paymentStatus;
    status;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hotel', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "hotelId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Room', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "guestName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "guestPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Booking.prototype, "guestEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "checkIn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "checkOut", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 1 }),
    __metadata("design:type", Number)
], Booking.prototype, "roomCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PaymentMethod, default: PaymentMethod.CASH_AT_HOTEL }),
    __metadata("design:type", String)
], Booking.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'PAID' }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: BookingStatus, default: BookingStatus.PENDING }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map