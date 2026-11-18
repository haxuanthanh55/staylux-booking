import { OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisMailService implements OnModuleInit {
    private readonly logger;
    redis: Redis;
    private transporter;
    private fallbackMemory;
    onModuleInit(): Promise<void>;
    setWithTTL(key: string, value: string, ttlSeconds?: number): Promise<void>;
    getKey(key: string): Promise<string | null>;
    delKey(key: string): Promise<void>;
    sendOtpNotification(target: string, otp: string, purpose: string): Promise<void>;
    sendBookingConfirmationEmail(email: string, booking: any): Promise<void>;
}
