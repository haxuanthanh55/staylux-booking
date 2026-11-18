import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../schemas/user.schema';
import { RedisMailService } from '../common/redis-mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private redisMailService: RedisMailService,
  ) {}

  // 1. Gửi mã OTP xác nhận (Đăng ký hoặc Quên mật khẩu - thời hạn 5 phút = 300s)
  async sendOtp(body: { target: string; type: 'REGISTER' | 'FORGOT_PASSWORD' }) {
    const target = (body.target || '').trim();
    if (!target) throw new BadRequestException('Vui lòng nhập Email hoặc Số điện thoại');

    if (body.type === 'FORGOT_PASSWORD') {
      const user = await this.userModel.findOne({
        $or: [{ email: target }, { phone: target }],
      });
      if (!user) {
        throw new NotFoundException('Không tìm thấy tài khoản với Email hoặc SĐT này');
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${body.type}:${target}`;

    // Lưu vào Redis đúng 300 giây (5 phút)
    await this.redisMailService.setWithTTL(redisKey, otp, 300);
    await this.redisMailService.sendOtpNotification(
      target,
      otp,
      body.type === 'REGISTER' ? 'Đăng ký tài khoản' : 'Khôi phục mật khẩu',
    );

    return {
      message: 'Mã xác nhận (hiệu lực 5 phút) đã được gửi!',
      // Trả kèm demoOtp trên localhost để bạn dễ dàng kiểm tra trên giao diện
      demoOtp: otp,
    };
  }

  // 2. Đăng ký tài khoản kèm kiểm tra mã OTP 5 phút
  async register(body: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    birthDate?: string;
    role?: UserRole;
    otp: string;
    otpTarget?: string;
  }) {
    const existing = await this.userModel.findOne({ email: body.email });
    if (existing) {
      throw new BadRequestException('Email này đã được sử dụng');
    }

    const target = (body.otpTarget || body.email).trim();
    const savedOtp = await this.redisMailService.getKey(`otp:REGISTER:${target}`);
    if (!savedOtp || savedOtp !== body.otp) {
      throw new BadRequestException('Mã xác nhận không đúng hoặc đã hết hạn (quá 5 phút)');
    }

    await this.redisMailService.delKey(`otp:REGISTER:${target}`);

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.userModel.create({
      email: body.email,
      password: hashedPassword,
      fullName: body.fullName,
      phone: body.phone || '',
      birthDate: body.birthDate || '',
      role: body.role || UserRole.CUSTOMER,
    });

    return this.signToken(user);
  }

  // 3. Quên mật khẩu: Xác thực OTP -> Đổi mật khẩu mới
  async resetPassword(body: { email: string; otp: string; newPassword: string }) {
    const target = (body.email || '').trim();
    const savedOtp = await this.redisMailService.getKey(`otp:FORGOT_PASSWORD:${target}`);
    if (!savedOtp || savedOtp !== body.otp) {
      throw new BadRequestException('Mã xác nhận không chính xác hoặc đã quá hạn 5 phút');
    }

    const user = await this.userModel.findOne({ email: target });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    user.password = await bcrypt.hash(body.newPassword, 10);
    await user.save();
    await this.redisMailService.delKey(`otp:FORGOT_PASSWORD:${target}`);

    return { message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
  }

  // 4. Đăng nhập
  async login(body: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi Quản trị viên');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return this.signToken(user);
  }

  // 5. Lấy và Chỉnh sửa thông tin cá nhân (Họ tên, Số điện thoại, Ngày sinh)
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
    };
  }

  async updateProfile(userId: string, body: { fullName: string; phone: string; birthDate: string }) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        fullName: body.fullName,
        phone: body.phone,
        birthDate: body.birthDate,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
    };
  }

  private signToken(user: User) {
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
}