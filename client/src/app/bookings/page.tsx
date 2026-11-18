'use client';

import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Tag, Button, Popconfirm, App } from 'antd';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import { api, API_URL } from '@/lib/api';

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'gold' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'blue' },
  CHECKED_IN: { label: 'Đã nhận phòng', color: 'cyan' },
  COMPLETED: { label: 'Hoàn thành', color: 'green' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
};

const paymentMap: Record<string, { label: string; color: string }> = {
  CASH_AT_HOTEL: { label: 'Tại Khách sạn', color: 'default' },
  BANK_TRANSFER: { label: 'Chuyển khoản', color: 'blue' },
  VNPAY_WALLET: { label: 'VNPAY', color: 'cyan' },
};

export default function MyBookingsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => (await api.get('/bookings/my')).data,
  });

  useEffect(() => {
    const socket = io(API_URL);
    socket.on('booking:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      message.info('Trạng thái đơn đặt phòng của bạn vừa được cập nhật!');
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient, message]);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
      message.success('Đã hủy đơn đặt phòng');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    } catch {
      message.error('Không thể hủy đơn');
    }
  };

  const formatVND = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Lịch sử đặt phòng & Thanh toán</h1>
      <p className="text-sm opacity-75 mb-6">Theo dõi trạng thái đơn và phương thức thanh toán của bạn</p>

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={bookings}
        columns={[
          {
            title: 'Khách sạn & Phòng',
            key: 'hotel',
            render: (_, r: any) => (
              <div>
                <div className="font-bold text-orange-600">{r.hotelId?.name}</div>
                <div className="text-xs opacity-75">{r.roomId?.name} (x{r.roomCount} phòng)</div>
              </div>
            ),
          },
          {
            title: 'Thông tin khách',
            key: 'guest',
            render: (_, r: any) => (
              <div>
                <div className="font-medium">{r.guestName}</div>
                <div className="text-xs opacity-70">{r.guestPhone} | {r.guestEmail}</div>
              </div>
            ),
          },
          {
            title: 'Thời gian lưu trú',
            key: 'dates',
            render: (_, r: any) => <span>{dayjs(r.checkIn).format('DD/MM/YYYY')} → {dayjs(r.checkOut).format('DD/MM/YYYY')}</span>,
          },
          {
            title: 'Thanh toán',
            key: 'payment',
            render: (_, r: any) => (
              <div>
                <div className="font-bold text-orange-600 mb-1">{formatVND(r.totalPrice)}</div>
                <Tag color={paymentMap[r.paymentMethod]?.color || 'default'} className="m-0 text-[10px]">
                  {paymentMap[r.paymentMethod]?.label || 'Khác'}
                </Tag>
              </div>
            ),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (st: string) => <Tag color={statusMap[st]?.color}>{statusMap[st]?.label || st}</Tag>,
          },
          {
            title: 'Hủy đơn',
            key: 'action',
            render: (_, r: any) => r.status === 'PENDING' ? (
              <Popconfirm title="Bạn chắc chắn muốn hủy đơn này?" onConfirm={() => handleCancel(r._id)} okText="Hủy ngay" cancelText="Không">
                <Button danger size="small">Hủy phòng</Button>
              </Popconfirm>
            ) : null,
          },
        ]}
      />
    </div>
  );
}