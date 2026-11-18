import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Hotel } from './schemas/hotel.schema';
import { Room } from './schemas/room.schema';
export declare class SeedService implements OnModuleInit {
    private userModel;
    private hotelModel;
    private roomModel;
    private readonly logger;
    constructor(userModel: Model<User>, hotelModel: Model<Hotel>, roomModel: Model<Room>);
    onModuleInit(): Promise<void>;
}
