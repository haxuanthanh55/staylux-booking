import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(body: {
        target: string;
        type: 'REGISTER' | 'FORGOT_PASSWORD';
    }): Promise<{
        message: string;
        demoOtp: string;
    }>;
    register(body: any): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            phone: string;
            birthDate: string;
            role: import("../schemas/user.schema").UserRole;
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
            role: import("../schemas/user.schema").UserRole;
        };
    }>;
    getProfile(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string;
        role: import("../schemas/user.schema").UserRole;
    }>;
    updateProfile(req: any, body: {
        fullName: string;
        phone: string;
        birthDate: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        phone: string;
        birthDate: string;
        role: import("../schemas/user.schema").UserRole;
    }>;
}
