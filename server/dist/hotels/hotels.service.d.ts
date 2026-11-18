import { Model } from 'mongoose';
import { Hotel, HotelStatus } from '../schemas/hotel.schema';
import { Room } from '../schemas/room.schema';
import { Booking } from '../schemas/booking.schema';
import { User } from '../schemas/user.schema';
import { RedisMailService } from '../common/redis-mail.service';
export declare class HotelsService {
    private hotelModel;
    private roomModel;
    private bookingModel;
    private userModel;
    private redisMailService;
    constructor(hotelModel: Model<Hotel>, roomModel: Model<Room>, bookingModel: Model<Booking>, userModel: Model<User>, redisMailService: RedisMailService);
    findAllPublic(query: {
        city?: string;
        keyword?: string;
        maxPrice?: number;
        starRating?: number;
    }): Promise<any>;
    findOneWithRooms(id: string): Promise<{
        hotel: Hotel & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        rooms: any[];
    }>;
    findPartnerHotels(ownerId: string): Promise<{
        rooms: (Room & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        name: string;
        city: string;
        address: string;
        description: string;
        starRating: number;
        images: string[];
        amenities: string[];
        minPrice: number;
        status: HotelStatus;
        ownerId: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    createHotel(ownerId: string, body: any): Promise<import("mongoose").Document<unknown, {}, Hotel, {}, import("mongoose").DefaultSchemaOptions> & Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createRoom(hotelId: string, body: any): Promise<import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteRoom(roomId: string): Promise<(import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findAllForAdmin(): Promise<(import("mongoose").Document<unknown, {}, Hotel, {}, import("mongoose").DefaultSchemaOptions> & Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateHotelStatus(hotelId: string, status: HotelStatus): Promise<(import("mongoose").Document<unknown, {}, Hotel, {}, import("mongoose").DefaultSchemaOptions> & Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findAllUsers(): Promise<(import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleUserActive(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalHotels: number;
        pendingHotels: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
}
