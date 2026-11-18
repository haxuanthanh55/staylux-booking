import { Document, Types } from 'mongoose';
export declare class Room extends Document {
    hotelId: Types.ObjectId;
    name: string;
    pricePerNight: number;
    capacity: number;
    totalRooms: number;
    amenities: string[];
    image: string;
}
export declare const RoomSchema: import("mongoose").Schema<Room, import("mongoose").Model<Room, any, any, any, any, any, Room & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Room, Document<unknown, {}, Room, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amenities?: import("mongoose").SchemaDefinitionProperty<string[], Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    hotelId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pricePerNight?: import("mongoose").SchemaDefinitionProperty<number, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    capacity?: import("mongoose").SchemaDefinitionProperty<number, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalRooms?: import("mongoose").SchemaDefinitionProperty<number, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Room>;
