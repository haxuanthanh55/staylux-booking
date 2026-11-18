"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const seed_service_1 = require("./seed.service");
const events_gateway_1 = require("./events.gateway");
const hotels_service_1 = require("./hotels/hotels.service");
const bookings_service_1 = require("./bookings/bookings.service");
const api_controller_1 = require("./api.controller");
const user_schema_1 = require("./schemas/user.schema");
const hotel_schema_1 = require("./schemas/hotel.schema");
const room_schema_1 = require("./schemas/room.schema");
const booking_schema_1 = require("./schemas/booking.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI ||
                'mongodb+srv://babysharkkk123_db_user:RzoUJXhIQA8ILKz5@bac.yarjkvm.mongodb.net/staylux_db?retryWrites=true&w=majority'),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: hotel_schema_1.Hotel.name, schema: hotel_schema_1.HotelSchema },
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [api_controller_1.ApiController],
        providers: [seed_service_1.SeedService, events_gateway_1.EventsGateway, hotels_service_1.HotelsService, bookings_service_1.BookingsService],
    })
], AppModule);
``;
//# sourceMappingURL=app.module.js.map