'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Tabs,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  App,
} from 'antd';
import { PlusOutlined, DeleteOutlined, BellOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import { api, API_URL } from '@/lib/api';

const statusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'Chờ xác nhận', color: 'gold' },
  CONFIRMED: { text: 'Đã xác nhận', color: 'blue' },
  CHECKED_IN: { text: 'Đã nhận phòng', color: 'cyan' },
  COMPLETED: { text: 'Hoàn thành', color: 'green' },
  CANCELLED: { text: 'Đã hủy', color: 'red' },
};

const hotelStatusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'Chờ Admin duyệt', color: 'gold' },
  APPROVED: { text: 'Đang hoạt động', color: 'green' },
  REJECTED: { text: 'Bị từ chối', color: 'red' },
};

export default function PartnerDashboardPage() {
  const { message, notification } = App.useApp();
  const queryClient = useQueryClient();

  const [openHotelModal, setOpenHotelModal] = useState(false);
  const [openRoomModal, setOpenRoomModal] = useState<string | null>(null);
  const [hotelForm] = Form.useForm();
  const [roomForm] = Form.useForm();

  const { data: myHotels = [], isLoading: loadingHotels } = useQuery({
    queryKey: ['partner-hotels'],
    queryFn: async () => (await api.get('/partner/hotels')).data,
  });

  const { data: partnerBookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['partner-bookings'],
    queryFn: async () => (await api.get('/partner/bookings')).data,
  });

  // Lắng nghe thông báo đặt phòng mới Realtime qua Socket.IO
  // Lắng nghe thông báo đặt phòng mới Realtime qua Socket.IO
  useEffect(() => {
    const socket = io(API_URL);
    socket.on('booking:created', (newBooking: any) => {
      notification.open({
        message: '🔔 Có đơn đặt phòng mới!',
        description: `Khách hàng ${newBooking.guestName} vừa đặt phòng tại ${newBooking.hotelId?.name || 'khách sạn của bạn'}.`,
        placement: 'topRight',
        duration: 6,
      });
      queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
    });
    return () => {
      socket.disconnect();
    };
  }, [notification, queryClient]);

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    await api.patch(`/bookings/${id}/status`, { status });
    message.success('Đã cập nhật trạng thái đơn đặt phòng');
    queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
  };

  const handleCreateHotel = async (values: any) => {
    await api.post('/partner/hotels', {
      ...values,
      images: [values.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000'],
      amenities: values.amenities || ['Wi-Fi miễn phí', 'Bữa sáng miễn phí'],
    });
    message.success('Đã gửi hồ sơ khách sạn! Chờ Admin phê duyệt.');
    setOpenHotelModal(false);
    hotelForm.resetFields();
    queryClient.invalidateQueries({ queryKey: ['partner-hotels'] });
  };

  const handleCreateRoom = async (values: any) => {
    if (!openRoomModal) return;
    await api.post(`/partner/hotels/${openRoomModal}/rooms`, {
      ...values,
      amenities: values.amenities || ['Giường đôi lớn', 'Bữa sáng miễn phí'],
    });
    message.success('Đã thêm hạng phòng mới!');
    setOpenRoomModal(null);
    roomForm.resetFields();
    queryClient.invalidateQueries({ queryKey: ['partner-hotels'] });
  };

  const handleDeleteRoom = async (roomId: string) => {
    await api.delete(`/partner/rooms/${roomId}`);
    message.success('Đã xóa hạng phòng');
    queryClient.invalidateQueries({ queryKey: ['partner-hotels'] });
  };

  const totalRevenue = partnerBookings
    .filter((b: any) => b.status !== 'CANCELLED')
    .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Kênh Đối tác Khách sạn</h1>
          <p className="text-sm opacity-75">
            Quản lý khách sạn, hạng phòng và duyệt đơn đặt phòng thời gian thực
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setOpenHotelModal(true)}
          style={{
            background: 'linear-gradient(90deg, #FF6B00 0%, #FFA800 100%)',
            border: 'none',
            fontWeight: 700,
          }}
        >
          Đăng ký Khách sạn mới
        </Button>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">TỔNG SỐ ĐƠN ĐẶT PHÒNG</div>
          <div className="text-3xl font-extrabold mt-1">{partnerBookings.length} đơn</div>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">DOANH THU DỰ KIẾN</div>
          <div className="text-3xl font-extrabold mt-1 text-orange-500">
            {formatVND(totalRevenue)}
          </div>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">KHÁCH SẠN SỞ HỮU</div>
          <div className="text-3xl font-extrabold mt-1">{myHotels.length} cơ sở</div>
        </Card>
      </div>

      <Tabs
        defaultActiveKey="bookings"
        items={[
          {
            key: 'bookings',
            label: (
              <span className="font-bold">
                <BellOutlined /> Đơn đặt phòng ({partnerBookings.length})
              </span>
            ),
            children: (
              <Table
                rowKey="_id"
                loading={loadingBookings}
                dataSource={partnerBookings}
                columns={[
                  {
                    title: 'Khách hàng',
                    key: 'guest',
                    render: (_, r: any) => (
                      <div>
                        <div className="font-bold">{r.guestName}</div>
                        <div className="text-xs opacity-70">{r.guestPhone}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Khách sạn & Phòng',
                    key: 'room',
                    render: (_, r: any) => (
                      <div>
                        <div className="font-semibold">{r.hotelId?.name}</div>
                        <div className="text-xs opacity-75">
                          {r.roomId?.name} (x{r.roomCount} phòng)
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Ngày lưu trú',
                    key: 'dates',
                    render: (_, r: any) => (
                      <span>
                        {dayjs(r.checkIn).format('DD/MM/YYYY')} - {dayjs(r.checkOut).format('DD/MM/YYYY')}
                      </span>
                    ),
                  },
                  {
                    title: 'Tổng tiền',
                    dataIndex: 'totalPrice',
                    render: (v: number) => (
                      <span className="font-bold text-orange-600">{formatVND(v)}</span>
                    ),
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    render: (st: string) => (
                      <Tag color={statusLabels[st]?.color}>{statusLabels[st]?.text}</Tag>
                    ),
                  },
                  {
                    title: 'Xử lý đơn',
                    key: 'actions',
                    render: (_, r: any) => (
                      <Space wrap>
                        {r.status === 'PENDING' && (
                          <>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleUpdateBookingStatus(r._id, 'CONFIRMED')}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              danger
                              size="small"
                              onClick={() => handleUpdateBookingStatus(r._id, 'CANCELLED')}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        {r.status === 'CONFIRMED' && (
                          <Button
                            size="small"
                            onClick={() => handleUpdateBookingStatus(r._id, 'CHECKED_IN')}
                          >
                            Khách nhận phòng
                          </Button>
                        )}
                        {r.status === 'CHECKED_IN' && (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleUpdateBookingStatus(r._id, 'COMPLETED')}
                          >
                            Trả phòng (Hoàn thành)
                          </Button>
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: 'hotels',
            label: <span className="font-bold">Quản lý Khách sạn & Hạng phòng</span>,
            children: (
              <div className="space-y-6">
                {myHotels.map((hotel: any) => (
                  <Card
                    key={hotel._id}
                    className="rounded-2xl shadow-sm"
                    title={
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{hotel.name}</span>
                          <Tag color="orange">{hotel.city}</Tag>
                          <Tag color={hotelStatusLabels[hotel.status]?.color}>
                            {hotelStatusLabels[hotel.status]?.text}
                          </Tag>
                        </div>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setOpenRoomModal(hotel._id)}
                        >
                          Thêm hạng phòng
                        </Button>
                      </div>
                    }
                  >
                    <Table
                      rowKey="_id"
                      pagination={false}
                      dataSource={hotel.rooms || []}
                      columns={[
                        { title: 'Tên hạng phòng', dataIndex: 'name', className: 'font-semibold' },
                        {
                          title: 'Giá / đêm',
                          dataIndex: 'pricePerNight',
                          render: (v: number) => (
                            <span className="text-orange-600 font-bold">{formatVND(v)}</span>
                          ),
                        },
                        { title: 'Sức chứa', dataIndex: 'capacity', render: (c: number) => `${c} khách` },
                        { title: 'Tổng số phòng', dataIndex: 'totalRooms' },
                        {
                          title: 'Xóa',
                          key: 'del',
                          render: (_, rm: any) => (
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteRoom(rm._id)}
                            />
                          ),
                        },
                      ]}
                    />
                  </Card>
                ))}
              </div>
            ),
          },
        ]}
      />

      {/* Modal Đăng ký khách sạn mới */}
      <Modal
        open={openHotelModal}
        onCancel={() => setOpenHotelModal(false)}
        footer={null}
        title="Đăng ký Khách sạn mới"
      >
        <Form
          form={hotelForm}
          layout="vertical"
          onFinish={handleCreateHotel}
          initialValues={{ city: 'Hà Nội', starRating: 5, minPrice: 1200000 }}
        >
          <Form.Item label="Tên khách sạn" name="name" rules={[{ required: true }]}>
            <Input placeholder="VD: StayLux Boutique Hà Nội" />
          </Form.Item>
          <Form.Item label="Thành phố" name="city" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Hà Nội', label: 'Hà Nội' },
                { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                { value: 'Huế', label: 'Huế' },
                { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ chi tiết" name="address" rules={[{ required: true }]}>
            <Input placeholder="Số nhà, đường, quận..." />
          </Form.Item>
          <Form.Item label="Giá thấp nhất dự kiến (VND/đêm)" name="minPrice" rules={[{ required: true }]}>
            <InputNumber className="w-full" step={100000} />
          </Form.Item>
          <Form.Item label="Link ảnh đại diện khách sạn" name="imageUrl">
            <Input placeholder="Để trống sẽ dùng ảnh mặc định" />
          </Form.Item>
          <Form.Item label="Mô tả khách sạn" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về tiện ích, vị trí..." />
          </Form.Item>
          <Button htmlType="submit" type="primary" block size="large">
            Gửi hồ sơ chờ duyệt
          </Button>
        </Form>
      </Modal>

      {/* Modal Thêm hạng phòng */}
      <Modal
        open={!!openRoomModal}
        onCancel={() => setOpenRoomModal(null)}
        footer={null}
        title="Thêm hạng phòng mới"
      >
        <Form
          form={roomForm}
          layout="vertical"
          onFinish={handleCreateRoom}
          initialValues={{ capacity: 2, totalRooms: 5, pricePerNight: 1500000 }}
        >
          <Form.Item label="Tên hạng phòng" name="name" rules={[{ required: true }]}>
            <Input placeholder="VD: Phòng Deluxe Hướng Biển" />
          </Form.Item>
          <Form.Item label="Giá mỗi đêm (VND)" name="pricePerNight" rules={[{ required: true }]}>
            <InputNumber className="w-full" step={100000} />
          </Form.Item>
          <Form.Item label="Sức chứa (Số khách)" name="capacity" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>
          <Form.Item label="Số lượng phòng hiện có" name="totalRooms" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
          <Button htmlType="submit" type="primary" block size="large">
            Lưu hạng phòng
          </Button>
        </Form>
      </Modal>
    </div>
  );
}