"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("./schemas/user.schema");
const hotel_schema_1 = require("./schemas/hotel.schema");
const room_schema_1 = require("./schemas/room.schema");
let SeedService = SeedService_1 = class SeedService {
    userModel;
    hotelModel;
    roomModel;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(userModel, hotelModel, roomModel) {
        this.userModel = userModel;
        this.hotelModel = hotelModel;
        this.roomModel = roomModel;
    }
    async onModuleInit() {
        const userCount = await this.userModel.countDocuments();
        if (userCount > 0)
            return;
        this.logger.log('Đang khởi tạo dữ liệu mẫu tiếng Việt cho StayLux...');
        const passwordHash = await bcrypt.hash('123456', 10);
        await this.userModel.create({
            email: 'admin@staylux.vn',
            password: passwordHash,
            fullName: 'Quản Trị Viên StayLux',
            phone: '0901000001',
            role: user_schema_1.UserRole.ADMIN,
        });
        const partner = await this.userModel.create({
            email: 'doitac@staylux.vn',
            password: passwordHash,
            fullName: 'Đối Tác Khách Sạn',
            phone: '0902000002',
            role: user_schema_1.UserRole.PARTNER,
        });
        await this.userModel.create({
            email: 'khachhang@staylux.vn',
            password: passwordHash,
            fullName: 'Trần Thị Ngọc Ánh',
            phone: '0903000003',
            role: user_schema_1.UserRole.CUSTOMER,
        });
        const hotelsData = [
            {
                name: 'The Grand Oasis Hà Nội',
                city: 'Hà Nội',
                address: '18 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
                description: 'Khách sạn 5 sao sang trọng bậc nhất trung tâm Hoàn Kiếm với hồ bơi vô cực trên tầng thượng, spa trị liệu cao cấp và nhà hàng Á - Âu.',
                starRating: 5,
                minPrice: 1850000,
                status: hotel_schema_1.HotelStatus.APPROVED,
                ownerId: partner._id,
                images: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000',
                ],
                amenities: ['Wi-Fi miễn phí', 'Hồ bơi vô cực', 'Bữa sáng miễn phí', 'Phòng Gym & Spa', 'Đưa đón sân bay'],
            },
            {
                name: 'StayLux Ocean Resort Đà Nẵng',
                city: 'Đà Nẵng',
                address: '88 Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng',
                description: 'Khu nghỉ dưỡng sát biển Mỹ Khê với tầm nhìn hướng biển tuyệt đẹp, bãi biển riêng và khu vui chơi gia đình.',
                starRating: 5,
                minPrice: 2200000,
                status: hotel_schema_1.HotelStatus.APPROVED,
                ownerId: partner._id,
                images: [
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000',
                ],
                amenities: ['Wi-Fi miễn phí', 'Hồ bơi ngoài trời', 'Giáp biển', 'Nhà hàng hải sản', 'Bar tầng thượng'],
            },
            {
                name: 'Imperial Heritage Huế Hotel',
                city: 'Huế',
                address: '15 Lê Lợi, Thành phố Huế',
                description: 'Không gian nghỉ dưỡng mang đậm kiến trúc cố đô bên dòng sông Hương thơ mộng, yên tĩnh và ấm cúng.',
                starRating: 4,
                minPrice: 1250000,
                status: hotel_schema_1.HotelStatus.APPROVED,
                ownerId: partner._id,
                images: [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000',
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000',
                ],
                amenities: ['Wi-Fi miễn phí', 'Bữa sáng buffet', 'Hồ bơi nước ấm', 'Cho thuê xe đạp'],
            },
            {
                name: 'Sài Gòn Boutique Stay (Đang chờ duyệt)',
                city: 'TP. Hồ Chí Minh',
                address: '102 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
                description: 'Khách sạn mới đăng ký bởi đối tác, đang chờ Admin phê duyệt trên trang quản trị.',
                starRating: 4,
                minPrice: 1500000,
                status: hotel_schema_1.HotelStatus.PENDING,
                ownerId: partner._id,
                images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000'],
                amenities: ['Wi-Fi miễn phí', 'Bữa sáng miễn phí', 'Trung tâm Quận 1'],
            },
        ];
        const createdHotels = await this.hotelModel.insertMany(hotelsData);
        for (const hotel of createdHotels) {
            await this.roomModel.insertMany([
                {
                    hotelId: hotel._id,
                    name: 'Phòng Deluxe Giường Đôi',
                    pricePerNight: hotel.minPrice,
                    capacity: 2,
                    totalRooms: 8,
                    amenities: ['Giường King', 'Bữa sáng miễn phí', 'Hủy phòng miễn phí', 'Ban công'],
                    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
                },
                {
                    hotelId: hotel._id,
                    name: 'Phòng Suite Gia Đình Hướng Biển / Phố',
                    pricePerNight: hotel.minPrice + 1200000,
                    capacity: 4,
                    totalRooms: 4,
                    amenities: ['2 Giường lớn', 'Bồn tắm nằm', 'Bữa sáng miễn phí', 'Phòng khách riêng'],
                    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
                },
            ]);
        }
        this.logger.log('Hoàn tất tạo dữ liệu mẫu StayLux! (Mật khẩu chung 3 tài khoản: 123456)');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(hotel_schema_1.Hotel.name)),
    __param(2, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map