import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RedisMailService implements OnModuleInit {
  private readonly logger = new Logger(RedisMailService.name);
  public redis: Redis;
  private transporter: nodemailer.Transporter;
  // Bộ nhớ dự phòng nếu bạn quên bật container Redis
  private fallbackMemory = new Map<string, { value: string; expiresAt: number }>();

  async onModuleInit() {
    // 1. Kết nối Redis
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });

    this.redis.on('connect', () => this.logger.log('Đã kết nối Redis Cache thành công!'));
    this.redis.on('error', () =>
      this.logger.warn('Không tìm thấy Redis ở cổng 6379 - Đang dùng bộ nhớ RAM dự phòng.'),
    );

    // 2. Cấu hình gửi Email (Hỗ trợ cả Gmail thật hoặc hộp thư test Ethereal tự động)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
      } catch {
        this.logger.warn('Chế độ gửi mail Localhost Console được kích hoạt.');
      }
    }
  }

  // Lưu key với thời gian sống (TTL tính bằng giây - 5 phút = 300 giây)
  async setWithTTL(key: string, value: string, ttlSeconds = 300) {
    try {
      if (this.redis.status === 'ready') {
        await this.redis.set(key, value, 'EX', ttlSeconds);
        return;
      }
    } catch {}
    this.fallbackMemory.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async getKey(key: string): Promise<string | null> {
    try {
      if (this.redis.status === 'ready') {
        return await this.redis.get(key);
      }
    } catch {}
    const item = this.fallbackMemory.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.fallbackMemory.delete(key);
      return null;
    }
    return item.value;
  }

  async delKey(key: string) {
    try {
      if (this.redis.status === 'ready') {
        await this.redis.del(key);
      }
    } catch {}
    this.fallbackMemory.delete(key);
  }

  // Gửi mã OTP xác nhận (hiệu lực 5 phút) qua Email hoặc SĐT
  async sendOtpNotification(target: string, otp: string, purpose: string) {
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
        if (preview) this.logger.log(`Xem giao diện Email vừa gửi tại: ${preview}`);
      } catch (e) {
        this.logger.warn('Đã hiển thị mã OTP trực tiếp trên Terminal.');
      }
    }
  }

  // Gửi thông tin đặt phòng & thanh toán về Email khách hàng
  async sendBookingConfirmationEmail(email: string, booking: any) {
    const paymentLabels: Record<string, string> = {
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
        if (preview) this.logger.log(`Xem Email hóa đơn đặt phòng tại: ${preview}`);
      } catch {}
    }
  }
}