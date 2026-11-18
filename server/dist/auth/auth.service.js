"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("../schemas/user.schema");
const redis_mail_service_1 = require("../common/redis-mail.service");
let AuthService = class AuthService {
    userModel;
    jwtService;
    redisMailService;
    constructor(userModel, jwtService, redisMailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.redisMailService = redisMailService;
    }
    async sendOtp(body) {
        const target = (body.target || '').trim();
        if (!target)
            throw new common_1.BadRequestException('Vui lòng nhập Email hoặc Số điện thoại');
        if (body.type === 'FORGOT_PASSWORD') {
            const user = await this.userModel.findOne({
                $or: [{ email: target }, { phone: target }],
            });
            if (!user) {
                throw new common_1.NotFoundException('Không tìm thấy tài khoản với Email hoặc SĐT này');
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const redisKey = `otp:${body.type}:${target}`;
        await this.redisMailService.setWithTTL(redisKey, otp, 300);
        await this.redisMailService.sendOtpNotification(target, otp, body.type === 'REGISTER' ? 'Đăng ký tài khoản' : 'Khôi phục mật khẩu');
        return {
            message: 'Mã xác nhận (hiệu lực 5 phút) đã được gửi!',
            demoOtp: otp,
        };
    }
    async register(body) {
        const existing = await this.userModel.findOne({ email: body.email });
        if (existing) {
            throw new common_1.BadRequestException('Email này đã được sử dụng');
        }
        const target = (body.otpTarget || body.email).trim();
        const savedOtp = await this.redisMailService.getKey(`otp:REGISTER:${target}`);
        if (!savedOtp || savedOtp !== body.otp) {
            throw new common_1.BadRequestException('Mã xác nhận không đúng hoặc đã hết hạn (quá 5 phút)');
        }
        await this.redisMailService.delKey(`otp:REGISTER:${target}`);
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await this.userModel.create({
            email: body.email,
            password: hashedPassword,
            fullName: body.fullName,
            phone: body.phone || '',
            birthDate: body.birthDate || '',
            role: body.role || user_schema_1.UserRole.CUSTOMER,
        });
        return this.signToken(user);
    }
    async resetPassword(body) {
        const target = (body.email || '').trim();
        const savedOtp = await this.redisMailService.getKey(`otp:FORGOT_PASSWORD:${target}`);
        if (!savedOtp || savedOtp !== body.otp) {
            throw new common_1.BadRequestException('Mã xác nhận không chính xác hoặc đã quá hạn 5 phút');
        }
        const user = await this.userModel.findOne({ email: target });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy tài khoản');
        user.password = await bcrypt.hash(body.newPassword, 10);
        await user.save();
        await this.redisMailService.delKey(`otp:FORGOT_PASSWORD:${target}`);
        return { message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
    }
    async login(body) {
        const user = await this.userModel.findOne({ email: body.email });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị khóa bởi Quản trị viên');
        }
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        return this.signToken(user);
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        return {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            birthDate: user.birthDate,
            role: user.role,
        };
    }
    async updateProfile(userId, body) {
        const user = await this.userModel.findByIdAndUpdate(userId, {
            fullName: body.fullName,
            phone: body.phone,
            birthDate: body.birthDate,
        }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        return {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            birthDate: user.birthDate,
            role: user.role,
        };
    }
    signToken(user) {
        const payload = { sub: user._id, email: user.email, role: user.role, fullName: user.fullName };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                birthDate: user.birthDate || '',
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        redis_mail_service_1.RedisMailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map