import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body() body: { target: string; type: 'REGISTER' | 'FORGOT_PASSWORD' }) {
    return this.authService.sendOtp(body);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() body: { fullName: string; phone: string; birthDate: string }) {
    return this.authService.updateProfile(req.user.sub, body);
  }
}