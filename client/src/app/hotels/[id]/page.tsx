'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Rate, Tag, Table, Modal, Form, Input, InputNumber, DatePicker, Select, Spin, App, Button } from 'antd';
import { EnvironmentOutlined, UserOutlined, CheckCircleOutlined, ArrowLeftOutlined, FireFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import { useApp } from '@/providers/AppProvider';

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useApp();
  const { message } = App.useApp();

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['hotel-detail', id],
    queryFn: async () => (await api.get(`/hotels/${id}`)).data,
  });

  const formatVND = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const handleOpenBook = (room: any) => {
    if (room.availableRooms <= 0) {
      message.error('Hạng phòng này đã hết phòng trống. Vui lòng chọn hạng phòng khác.');
      return;
    }
    if (!user) {
      message.warning('Vui lòng bấm nút "Đăng nhập/Đăng ký" ở góc trên bên phải để đặt phòng!');
      return;
    }
    setSelectedRoom(room);
    form.setFieldsValue({
      guestName: user.fullName,
      guestPhone: user.phone || '',
      guestEmail: user.email,
      roomCount: 1,
      paymentMethod: 'CASH_AT_HOTEL',
      dates: [dayjs().add(1, 'day'), dayjs().add(2, 'day')],
    });
  };

  const handleConfirmBooking = async (values: any) => {
    setSubmitting(true);
    try {
      const [checkIn, checkOut] = values.dates;
      await api.post('/bookings', {
        roomId: selectedRoom._id,
        guestName: values.guestName,
        guestPhone: values.guestPhone,
        guestEmail: values.guestEmail,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        roomCount: values.roomCount,
        paymentMethod: values.paymentMethod,
      });
      message.success('Đặt phòng thành công! Xác nhận đã được gửi về Email của bạn.');
      setSelectedRoom(null);
      router.push('/bookings');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi đặt phòng');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-24 text-center"><Spin size="large" /></div>;
  if (!data?.hotel) return <div className="p-10 text-center">Không tìm thấy khách sạn</div>;

  const { hotel, rooms } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/')} className="mb-6">Quay lại tìm kiếm</Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="grid grid-cols-1 gap-4">
          <img src={hotel.images?.[0]} alt={hotel.name} className="w-full h-80 object-cover rounded-2xl shadow-md" />
        </div>
        <div>
          <Tag color="orange" className="mb-2 font-bold">{hotel.city}</Tag>
          <h1 className="text-3xl font-extrabold mb-2">{hotel.name}</h1>
          <Rate disabled defaultValue={hotel.starRating || 5} className="text-orange-400 mb-3" />
          <p className="text-sm opacity-80 mb-4 flex items-center gap-2"><EnvironmentOutlined className="text-orange-500" /> {hotel.address}</p>
          <h3 className="font-bold text-base mb-2">Giới thiệu khách sạn</h3>
          <p className="leading-relaxed opacity-85 mb-6">{hotel.description}</p>
          <div className="flex flex-wrap gap-2">
            {(hotel.amenities || []).map((item: string, idx: number) => (
              <Tag key={idx} color="gold" className="px-3 py-1 text-sm rounded-lg"><CheckCircleOutlined className="mr-1" /> {item}</Tag>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold mb-4">Chọn hạng phòng</h2>
      <Table
        rowKey="_id"
        dataSource={rooms}
        pagination={false}
        // Thêm tính năng click vào bất kỳ đâu trên dòng để chọn phòng
        onRow={(record: any) => ({
          onClick: () => handleOpenBook(record),
          style: { cursor: record.availableRooms > 0 ? 'pointer' : 'not-allowed' }
        })}
        rowClassName={(record: any) => record.availableRooms <= 0 ? 'opacity-50 bg-gray-50 dark:bg-zinc-900' : 'hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors'}
        columns={[
          {
            title: 'Loại phòng',
            key: 'name',
            render: (_, r: any) => (
              <div className="flex items-center gap-4">
                <img src={r.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400'} alt={r.name} className="w-28 h-20 object-cover rounded-xl hidden sm:block" />
                <div>
                  <div className="font-bold text-base text-orange-600">{r.name}</div>
                  <div className="text-xs mt-1">
                    {r.availableRooms > 0 ? (
                      <Tag color="green">Còn trống {r.availableRooms} phòng</Tag>
                    ) : (
                      <Tag color="red">Đã hết phòng</Tag>
                    )}
                  </div>
                </div>
              </div>
            ),
          },
          { title: 'Sức chứa', dataIndex: 'capacity', render: (c: number) => <span><UserOutlined className="mr-1 text-orange-500" /> {c} khách</span> },
          { title: 'Giá / đêm', dataIndex: 'pricePerNight', render: (p: number) => <span className="font-extrabold text-lg text-orange-500">{formatVND(p)}</span> },
          {
            title: 'Hành động',
            key: 'action',
            render: (_, r: any) => (
              <Button type="primary" size="large" disabled={r.availableRooms <= 0} className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold shadow-md rounded-full px-6">
                Đặt ngay
              </Button>
            ),
          },
        ]}
      />

      <Modal open={!!selectedRoom} onCancel={() => setSelectedRoom(null)} footer={null} title={<span className="text-lg font-bold">Đặt phòng: {selectedRoom?.name}</span>}>
        <Form form={form} layout="vertical" onFinish={handleConfirmBooking} scrollToFirstError>
          <Form.Item label="Họ và tên người nhận phòng" name="guestName" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input size="large" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Số điện thoại" name="guestPhone" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Email nhận xác nhận" name="guestEmail" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ' }]}>
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item label="Ngày nhận phòng - Ngày trả phòng" name="dates" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker.RangePicker size="large" className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Số lượng phòng" name="roomCount" rules={[{ required: true }]}>
            <InputNumber min={1} max={selectedRoom?.availableRooms || 1} size="large" className="w-full" addonAfter={`Tối đa ${selectedRoom?.availableRooms} phòng`} />
          </Form.Item>
          
          <Form.Item label="Phương thức thanh toán" name="paymentMethod" rules={[{ required: true }]}>
            <Select size="large" options={[
              { value: 'CASH_AT_HOTEL', label: 'Thanh toán tiền mặt tại Khách sạn' },
              { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng (VietQR)' },
              { value: 'VNPAY_WALLET', label: 'Ví điện tử VNPAY / Thẻ' }
            ]} />
          </Form.Item>

          <div className="p-3 rounded-xl bg-orange-50 dark:bg-zinc-800 mb-4 text-sm border border-orange-200 dark:border-zinc-700">
            Đơn giá: <strong className="text-orange-600">{formatVND(selectedRoom?.pricePerNight)} / đêm</strong>
          </div>

          <Button htmlType="submit" type="primary" size="large" loading={submitting} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold text-lg h-12">
            Xác nhận đặt phòng
          </Button>
        </Form>
      </Modal>
    </div>
  );
}