import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../schemas/user.schema';
import { RedisMailService } from '../common/redis-mail.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private redisMailService;
    constructor(userModel: Model<User>, jwtService: JwtService, redisMailService: RedisMailService);
    sendOtp(body: {
        target: string;
        type: 'REGISTER' | 'FORGOT_PASSWORD';
    }): Promise<{
        message: string;
        demoOtp: string;
    }>;
    register(body: {
        email: string;
        password: string;
        fullName: string;
        phone?: string;
        birthDate?: string;
        role?: UserRole;
        otp: string;
        otpTarget?: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            phone: string;
            birthDate: string;
            role: UserRole;
        };
    }>;
    resetPassword(body: {
        email: string;
        otp: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            phone: string;
            birthDate: string;
            role: UserRole;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string;
        role: UserRole;
    }>;
    updateProfile(userId: string, body: {
        fullName: string;
        phone: string;
        birthDate: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string;
        role: UserRole;
    }>;
    private signToken;
}
