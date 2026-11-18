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
exports.HotelSchema = exports.Hotel = exports.HotelStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var HotelStatus;
(function (HotelStatus) {
    HotelStatus["PENDING"] = "PENDING";
    HotelStatus["APPROVED"] = "APPROVED";
    HotelStatus["REJECTED"] = "REJECTED";
})(HotelStatus || (exports.HotelStatus = HotelStatus = {}));
let Hotel = class Hotel extends mongoose_2.Document {
    name;
    city;
    address;
    description;
    starRating;
    images;
    amenities;
    minPrice;
    status;
    ownerId;
};
exports.Hotel = Hotel;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hotel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hotel.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hotel.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hotel.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], Hotel.prototype, "starRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Hotel.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Hotel.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Hotel.prototype, "minPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: HotelStatus, default: HotelStatus.PENDING }),
    __metadata("design:type", String)
], Hotel.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Hotel.prototype, "ownerId", void 0);
exports.Hotel = Hotel = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Hotel);
exports.HotelSchema = mongoose_1.SchemaFactory.createForClass(Hotel);
//# sourceMappingURL=hotel.schema.js.map