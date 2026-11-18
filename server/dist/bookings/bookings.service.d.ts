import { Model } from 'mongoose';
import { Booking, BookingStatus } from '../schemas/booking.schema';
import { Room } from '../schemas/room.schema';
import { Hotel } from '../schemas/hotel.schema';
import { User } from '../schemas/user.schema';
import { EventsGateway } from '../events.gateway';
import { RedisMailService } from '../common/redis-mail.service';
export declare class BookingsService {
    private bookingModel;
    private roomModel;
    private hotelModel;
    private userModel;
    private eventsGateway;
    private redisMailService;
    constructor(bookingModel: Model<Booking>, roomModel: Model<Room>, hotelModel: Model<Hotel>, userModel: Model<User>, eventsGateway: EventsGateway, redisMailService: RedisMailService);
    createBooking(userId: string, body: any): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findUserBookings(userId: string): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findPartnerBookings(ownerId: string): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(bookingId: string, status: BookingStatus): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
