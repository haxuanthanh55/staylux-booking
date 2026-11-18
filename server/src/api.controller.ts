import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels/hotels.service';
import { BookingsService } from './bookings/bookings.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HotelStatus } from './schemas/hotel.schema';
import { BookingStatus } from './schemas/booking.schema';

@Controller('api')
export class ApiController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly bookingsService: BookingsService,
  ) {}

  // --- PUBLIC / KHÁCH HÀNG ---
  @Get('hotels')
  getHotels(@Query() query: any) {
    return this.hotelsService.findAllPublic(query);
  }

  @Get('hotels/:id')
  getHotelDetail(@Param('id') id: string) {
    return this.hotelsService.findOneWithRooms(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Req() req: any, @Body() body: any) {
    return this.bookingsService.createBooking(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/my')
  getMyBookings(@Req() req: any) {
    return this.bookingsService.findUserBookings(req.user.sub);
  }

  // --- ĐỐI TÁC (PARTNER) ---
  @UseGuards(JwtAuthGuard)
  @Get('partner/hotels')
  getPartnerHotels(@Req() req: any) {
    return this.hotelsService.findPartnerHotels(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('partner/hotels')
  createPartnerHotel(@Req() req: any, @Body() body: any) {
    return this.hotelsService.createHotel(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('partner/hotels/:hotelId/rooms')
  createRoom(@Param('hotelId') hotelId: string, @Body() body: any) {
    return this.hotelsService.createRoom(hotelId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('partner/rooms/:roomId')
  deleteRoom(@Param('roomId') roomId: string) {
    return this.hotelsService.deleteRoom(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('partner/bookings')
  getPartnerBookings(@Req() req: any) {
    return this.bookingsService.findPartnerBookings(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id/status')
  updateBookingStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingsService.updateStatus(id, status);
  }

  // --- QUẢN TRỊ VIÊN (ADMIN) ---
  @UseGuards(JwtAuthGuard)
  @Get('admin/stats')
  getAdminStats() {
    return this.hotelsService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/hotels')
  getAdminHotels() {
    return this.hotelsService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/hotels/:id/status')
  updateHotelStatus(@Param('id') id: string, @Body('status') status: HotelStatus) {
    return this.hotelsService.updateHotelStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  getAdminUsers() {
    return this.hotelsService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/users/:id/toggle')
  toggleUser(@Param('id') id: string) {
    return this.hotelsService.toggleUserActive(id);
  }
}