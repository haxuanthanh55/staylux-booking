import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed.service';
import { EventsGateway } from './events.gateway';
import { HotelsService } from './hotels/hotels.service';
import { BookingsService } from './bookings/bookings.service';
import { ApiController } from './api.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { Room, RoomSchema } from './schemas/room.schema';
import { Booking, BookingSchema } from './schemas/booking.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://babysharkkk123_db_user:RzoUJXhIQA8ILKz5@bac.yarjkvm.mongodb.net/staylux_db?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    AuthModule,
  ],
  controllers: [ApiController],
  providers: [SeedService, EventsGateway, HotelsService, BookingsService],
})
export class AppModule {}``