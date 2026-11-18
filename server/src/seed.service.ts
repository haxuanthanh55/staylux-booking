import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './schemas/user.schema';
import { Hotel, HotelStatus } from './schemas/hotel.schema';
import { Room } from './schemas/room.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userModel.countDocuments();
    if (userCount > 0) return;

    this.logger.log('Đang khởi tạo dữ liệu mẫu tiếng Việt cho StayLux...');
    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Tạo 3 tài khoản đại diện cho 3 Role (Mật khẩu chung: 123456)
    await this.userModel.create({
      email: 'admin@staylux.vn',
      password: passwordHash,
      fullName: 'Quản Trị Viên StayLux',
      phone: '0901000001',
      role: UserRole.ADMIN,
    });

    const partner = await this.userModel.create({
      email: 'doitac@staylux.vn',
      password: passwordHash,
      fullName: 'Đối Tác Khách Sạn',
      phone: '0902000002',
      role: UserRole.PARTNER,
    });

    await this.userModel.create({
      email: 'khachhang@staylux.vn',
      password: passwordHash,
      fullName: 'Trần Thị Ngọc Ánh',
      phone: '0903000003',
      role: UserRole.CUSTOMER,
    });

    // 2. Tạo danh sách khách sạn mẫu
    const hotelsData = [
      {
        name: 'The Grand Oasis Hà Nội',
        city: 'Hà Nội',
        address: '18 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
        description: 'Khách sạn 5 sao sang trọng bậc nhất trung tâm Hoàn Kiếm với hồ bơi vô cực trên tầng thượng, spa trị liệu cao cấp và nhà hàng Á - Âu.',
        starRating: 5,
        minPrice: 1850000,
        status: HotelStatus.APPROVED,
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
        status: HotelStatus.APPROVED,
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
        status: HotelStatus.APPROVED,
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
        status: HotelStatus.PENDING,
        ownerId: partner._id,
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000'],
        amenities: ['Wi-Fi miễn phí', 'Bữa sáng miễn phí', 'Trung tâm Quận 1'],
      },
    ];

    const createdHotels = await this.hotelModel.insertMany(hotelsData);

    // 3. Tạo các hạng phòng cho từng khách sạn
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
}