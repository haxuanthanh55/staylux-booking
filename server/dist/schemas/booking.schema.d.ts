import { Document, Types } from 'mongoose';
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentMethod {
    CASH_AT_HOTEL = "CASH_AT_HOTEL",
    BANK_TRANSFER = "BANK_TRANSFER",
    VNPAY_WALLET = "VNPAY_WALLET"
}
export declare class Booking extends Document {
    userId: Types.ObjectId;
    hotelId: Types.ObjectId;
    roomId: Types.ObjectId;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    checkIn: Date;
    checkOut: Date;
    roomCount: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    paymentStatus: string;
    status: BookingStatus;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, any, any, Booking & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, Booking, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<BookingStatus, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hotelId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    roomId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestName?: import("mongoose").SchemaDefinitionProperty<string, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestPhone?: import("mongoose").SchemaDefinitionProperty<string, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestEmail?: import("mongoose").SchemaDefinitionProperty<string, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checkIn?: import("mongoose").SchemaDefinitionProperty<Date, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checkOut?: import("mongoose").SchemaDefinitionProperty<Date, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    roomCount?: import("mongoose").SchemaDefinitionProperty<number, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalPrice?: import("mongoose").SchemaDefinitionProperty<number, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<PaymentMethod, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<string, Booking, Document<unknown, {}, Booking, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Booking & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Booking>;
