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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisMailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisMailService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const nodemailer = __importStar(require("nodemailer"));
let RedisMailService = RedisMailService_1 = class RedisMailService {
    logger = new common_1.Logger(RedisMailService_1.name);
    redis;
    transporter;
    fallbackMemory = new Map();
    async onModuleInit() {
        this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
            maxRetriesPerRequest: 1,
            retryStrategy: () => null,
        });
        this.redis.on('connect', () => this.logger.log('Đã kết nối Redis Cache thành công!'));
        this.redis.on('error', () => this.logger.warn('Không tìm thấy Redis ở cổng 6379 - Đang dùng bộ nhớ RAM dự phòng.'));
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        else {
            try {
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: { user: testAccount.user, pass: testAccount.pass },
                });
            }
            catch {
                this.logger.warn('Chế độ gửi mail Localhost Console được kích hoạt.');
            }
        }
    }
    async setWithTTL(key, value, ttlSeconds = 300) {
        try {
            if (this.redis.status === 'ready') {
                await this.redis.set(key, value, 'EX', ttlSeconds);
                return;
            }
        }
        catch { }
        this.fallbackMemory.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
    async getKey(key) {
        try {
            if (this.redis.status === 'ready') {
                return await this.redis.get(key);
            }
        }
        catch { }
        const item = this.fallbackMemory.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiresAt) {
            this.fallbackMemory.delete(key);
            return null;
        }
        return item.value;
    }
    async delKey(key) {
        try {
            if (this.redis.status === 'ready') {
                await this.redis.del(key);
            }
        }
        catch { }
        this.fallbackMemory.delete(key);
    }
    async sendOtpNotification(target, otp, purpose) {
        this.logger.log(`================================================`);
        this.logger.log(`[MÃ XÁC NHẬN OTP - ${purpose}] Gửi tới: ${target}`);
        this.logger.log(`>>> MÃ OTP CỦA BẠN LÀ: ${otp} (Hiệu lực: 5 phút) <<<`);
        this.logger.log(`================================================`);
        if (target.includes('@') && this.transporter) {
            try {
                const info = await this.transporter.sendMail({
                    from: '"StayLux Booking" <no-reply@staylux.vn>',
                    to: target,
                    subject: `[StayLux] Mã xác nhận ${purpose}: ${otp}`,
                    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #FF7A00; border-radius: 12px;">
              <h2 style="color: #FF7A00;">StayLux - Xác thực tài khoản</h2>
              <p>Mã xác nhận (OTP) cho yêu cầu <b>${purpose}</b> của bạn là:</p>
              <div style="font-size: 28px; font-weight: bold; color: #FF6B00; letter-spacing: 4px; margin: 16px 0;">
                ${otp}
              </div>
              <p><i>Lưu ý: Mã này chỉ có thời hạn trong vòng <b>5 phút</b>.</i></p>
            </div>
          `,
                });
                const preview = nodemailer.getTestMessageUrl(info);
                if (preview)
                    this.logger.log(`Xem giao diện Email vừa gửi tại: ${preview}`);
            }
            catch (e) {
                this.logger.warn('Đã hiển thị mã OTP trực tiếp trên Terminal.');
            }
        }
    }
    async sendBookingConfirmationEmail(email, booking) {
        const paymentLabels = {
            CASH_AT_HOTEL: 'Thanh toán trực tiếp tại khách sạn',
            BANK_TRANSFER: 'Chuyển khoản ngân hàng (VietQR)',
            VNPAY_WALLET: 'Ví điện tử VNPAY / Thẻ quốc tế',
        };
        this.logger.log(`================================================`);
        this.logger.log(`[EMAIL XÁC NHẬN ĐẶT PHÒNG] Gửi tới: ${email}`);
        this.logger.log(`Khách sạn: ${booking.hotelId?.name} | Phòng: ${booking.roomId?.name}`);
        this.logger.log(`Số lượng: ${booking.roomCount} phòng | Tổng tiền: ${booking.totalPrice} VND`);
        this.logger.log(`Phương thức TT: ${paymentLabels[booking.paymentMethod] || booking.paymentMethod}`);
        this.logger.log(`================================================`);
        if (email && email.includes('@') && this.transporter) {
            try {
                const info = await this.transporter.sendMail({
                    from: '"StayLux Booking" <booking@staylux.vn>',
                    to: email,
                    subject: `[StayLux] Xác nhận đặt phòng thành công - ${booking.hotelId?.name}`,
                    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #FF7A00; border-radius: 12px;">
              <h2 style="color: #FF7A00;">Chúc mừng bạn đã đặt phòng thành công tại StayLux!</h2>
              <p>Xin chào <b>${booking.guestName}</b>,</p>
              <p>Thông tin chi tiết đơn đặt phòng và thanh toán của bạn:</p>
              <ul>
                <li><b>Khách sạn:</b> ${booking.hotelId?.name} (${booking.hotelId?.city})</li>
                <li><b>Hạng phòng:</b> ${booking.roomId?.name}</li>
                <li><b>Số lượng phòng:</b> ${booking.roomCount} phòng</li>
                <li><b>Ngày nhận phòng:</b> ${new Date(booking.checkIn).toLocaleDateString('vi-VN')}</li>
                <li><b>Ngày trả phòng:</b> ${new Date(booking.checkOut).toLocaleDateString('vi-VN')}</li>
                <li><b>Phương thức thanh toán:</b> ${paymentLabels[booking.paymentMethod] || booking.paymentMethod}</li>
                <li><b>Tổng thanh toán:</b> <span style="color:#FF6B00;font-weight:bold;">${Number(booking.totalPrice).toLocaleString('vi-VN')} ₫</span></li>
              </ul>
              <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của StayLux!</p>
            </div>
          `,
                });
                const preview = nodemailer.getTestMessageUrl(info);
                if (preview)
                    this.logger.log(`Xem Email hóa đơn đặt phòng tại: ${preview}`);
            }
            catch { }
        }
    }
};
exports.RedisMailService = RedisMailService;
exports.RedisMailService = RedisMailService = RedisMailService_1 = __decorate([
    (0, common_1.Injectable)()
], RedisMailService);
//# sourceMappingURL=redis-mail.service.js.map