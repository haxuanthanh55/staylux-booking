import { Document, Types } from 'mongoose';
export declare enum HotelStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class Hotel extends Document {
    name: string;
    city: string;
    address: string;
    description: string;
    starRating: number;
    images: string[];
    amenities: string[];
    minPrice: number;
    status: HotelStatus;
    ownerId: Types.ObjectId;
}
export declare const HotelSchema: import("mongoose").Schema<Hotel, import("mongoose").Model<Hotel, any, any, any, any, any, Hotel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Hotel, Document<unknown, {}, Hotel, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    starRating?: import("mongoose").SchemaDefinitionProperty<number, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amenities?: import("mongoose").SchemaDefinitionProperty<string[], Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minPrice?: import("mongoose").SchemaDefinitionProperty<number, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<HotelStatus, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ownerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Hotel, Document<unknown, {}, Hotel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Hotel & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Hotel>;
