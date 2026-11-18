'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Tabs, Table, Tag, Button, Space, App } from 'antd';
import { CheckOutlined, CloseOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';

const statusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'Chờ duyệt', color: 'gold' },
  APPROVED: { text: 'Đã phê duyệt', color: 'green' },
  REJECTED: { text: 'Đã từ chối', color: 'red' },
};

export default function AdminDashboardPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data,
  });

  const { data: hotels = [], isLoading: loadingHotels } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: async () => (await api.get('/admin/hotels')).data,
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data,
  });

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const handleApproveHotel = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await api.patch(`/admin/hotels/${id}/status`, { status });
    message.success(
      status === 'APPROVED' ? 'Đã phê duyệt khách sạn lên trang chủ!' : 'Đã từ chối khách sạn',
    );
    queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    queryClient.invalidateQueries({ queryKey: ['hotels'] });
  };

  const handleToggleUser = async (id: string) => {
    await api.patch(`/admin/users/${id}/toggle`);
    message.success('Đã cập nhật trạng thái tài khoản');
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-1">Quản trị Hệ thống (Admin)</h1>
      <p className="text-sm opacity-75 mb-6">
        Kiểm duyệt đối tác khách sạn, quản lý tài khoản và theo dõi doanh thu toàn sàn StayLux
      </p>

      {/* 4 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">TỔNG NGƯỜI DÙNG</div>
          <div className="text-3xl font-extrabold mt-1">{stats?.totalUsers || 0}</div>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">KHÁCH SẠN ĐANG HOẠT ĐỘNG</div>
          <div className="text-3xl font-extrabold mt-1 text-green-600">
            {stats?.totalHotels || 0}
          </div>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">KHÁCH SẠN CHỜ DUYỆT</div>
          <div className="text-3xl font-extrabold mt-1 text-orange-500">
            {stats?.pendingHotels || 0}
          </div>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <div className="text-xs opacity-70 font-semibold">TỔNG DOANH THU ĐẶT PHÒNG</div>
          <div className="text-2xl font-extrabold mt-1 text-orange-600">
            {formatVND(stats?.totalRevenue || 0)}
          </div>
        </Card>
      </div>

      <Tabs
        defaultActiveKey="hotels"
        items={[
          {
            key: 'hotels',
            label: <span className="font-bold">Kiểm duyệt Khách sạn ({hotels.length})</span>,
            children: (
              <Table
                rowKey="_id"
                loading={loadingHotels}
                dataSource={hotels}
                columns={[
                  {
                    title: 'Tên khách sạn',
                    key: 'name',
                    render: (_, r: any) => (
                      <div>
                        <div className="font-bold text-base">{r.name}</div>
                        <div className="text-xs opacity-70">{r.address}</div>
                      </div>
                    ),
                  },
                  { title: 'Thành phố', dataIndex: 'city' },
                  {
                    title: 'Đối tác sở hữu',
                    key: 'owner',
                    render: (_, r: any) => (
                      <div>
                        <div className="font-medium">{r.ownerId?.fullName}</div>
                        <div className="text-xs opacity-70">{r.ownerId?.email}</div>
                      </div>
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
                    title: 'Hành động kiểm duyệt',
                    key: 'action',
                    render: (_, r: any) => (
                      <Space>
                        {r.status !== 'APPROVED' && (
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleApproveHotel(r._id, 'APPROVED')}
                          >
                            Phê duyệt
                          </Button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <Button
                            danger
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => handleApproveHotel(r._id, 'REJECTED')}
                          >
                            Từ chối
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
            key: 'users',
            label: <span className="font-bold">Quản lý Tài khoản ({users.length})</span>,
            children: (
              <Table
                rowKey="_id"
                loading={loadingUsers}
                dataSource={users}
                columns={[
                  { title: 'Họ và tên', dataIndex: 'fullName', className: 'font-semibold' },
                  { title: 'Email', dataIndex: 'email' },
                  { title: 'Số điện thoại', dataIndex: 'phone' },
                  {
                    title: 'Phân quyền',
                    dataIndex: 'role',
                    render: (role: string) => (
                      <Tag color={role === 'ADMIN' ? 'red' : role === 'PARTNER' ? 'blue' : 'orange'}>
                        {role === 'ADMIN' ? 'Quản trị viên' : role === 'PARTNER' ? 'Đối tác KS' : 'Khách hàng'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'isActive',
                    render: (active: boolean) =>
                      active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Đã khóa</Tag>,
                  },
                  {
                    title: 'Thao tác',
                    key: 'act',
                    render: (_, u: any) =>
                      u.role !== 'ADMIN' ? (
                        <Button
                          size="small"
                          danger={u.isActive}
                          icon={u.isActive ? <LockOutlined /> : <UnlockOutlined />}
                          onClick={() => handleToggleUser(u._id)}
                        >
                          {u.isActive ? 'Khóa TK' : 'Mở khóa'}
                        </Button>
                      ) : null,
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}