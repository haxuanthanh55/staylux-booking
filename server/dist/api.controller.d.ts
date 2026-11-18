import { HotelsService } from './hotels/hotels.service';
import { BookingsService } from './bookings/bookings.service';
import { HotelStatus } from './schemas/hotel.schema';
import { BookingStatus } from './schemas/booking.schema';
export declare class ApiController {
    private readonly hotelsService;
    private readonly bookingsService;
    constructor(hotelsService: HotelsService, bookingsService: BookingsService);
    getHotels(query: any): Promise<any>;
    getHotelDetail(id: string): Promise<{
        hotel: import("./schemas/hotel.schema").Hotel & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        rooms: any[];
    }>;
    createBooking(req: any, body: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyBookings(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getPartnerHotels(req: any): Promise<{
        rooms: (import("./schemas/room.schema").Room & Required<{
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
    createPartnerHotel(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hotel.schema").Hotel, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hotel.schema").Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createRoom(hotelId: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteRoom(roomId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getPartnerBookings(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateBookingStatus(id: string, status: BookingStatus): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAdminStats(): Promise<{
        totalUsers: number;
        totalHotels: number;
        pendingHotels: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
    getAdminHotels(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/hotel.schema").Hotel, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hotel.schema").Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateHotelStatus(id: string, status: HotelStatus): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/hotel.schema").Hotel, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hotel.schema").Hotel & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAdminUsers(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleUser(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
