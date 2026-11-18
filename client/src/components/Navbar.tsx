'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Modal, Tabs, Form, Input, Select, Space, Tag, Dropdown, App, DatePicker } from 'antd';
import {
  SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined,
  HistoryOutlined, ShopOutlined, SafetyCertificateOutlined,
  HomeOutlined, EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useApp } from '@/providers/AppProvider';
import { api } from '@/lib/api';

export default function Navbar() {
  const { isDark, toggleTheme, user, setAuth, logout } = useApp();
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();

  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Trạng thái OTP & Quên Mật Khẩu
  const [otpMode, setOtpMode] = useState<'REGISTER' | 'FORGOT_PASSWORD' | null>(null);
  const [tempData, setTempData] = useState<any>(null); // Lưu tạm dữ liệu đăng ký hoặc email quên MK
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  // Trạng thái Sửa hồ sơ
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  // Đăng nhập
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      setAuth(res.data.user, res.data.accessToken);
      message.success(`Chào mừng ${res.data.user.fullName}!`);
      setOpenModal(false);
      if (res.data.user.role === 'ADMIN') router.push('/admin');
      else if (res.data.user.role === 'PARTNER') router.push('/partner');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Bước 1: Gửi form Đăng ký -> Gọi API nhận OTP
  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { target: values.email, type: 'REGISTER' });
      message.success(res.data.message);
      setTempData(values);
      setOtpMode('REGISTER');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể gửi mã xác nhận');
    } finally {
      setLoading(false);
    }
  };

  // Tự động focus vào ô bị lỗi khi bấm Đăng ký
  const handleRegisterFailed = ({ errorFields }: any) => {
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0].name[0];
      registerForm.getFieldInstance(firstErrorField)?.focus();
    }
  };

  // Bước 1: Quên mật khẩu -> Gọi API nhận OTP
  const handleForgotPasswordSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { target: values.email, type: 'FORGOT_PASSWORD' });
      message.success(res.data.message);
      setTempData({ email: values.email, newPassword: values.newPassword });
      setOtpMode('FORGOT_PASSWORD');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể gửi mã xác nhận');
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP để hoàn tất Đăng ký hoặc Quên MK
  const handleVerifyOtp = async (values: any) => {
    setLoading(true);
    try {
      if (otpMode === 'REGISTER') {
        const res = await api.post('/auth/register', { ...tempData, otp: values.otp, otpTarget: tempData.email });
        setAuth(res.data.user, res.data.accessToken);
        message.success('Đăng ký tài khoản thành công!');
        setOpenModal(false);
        resetAllForms();
      } else if (otpMode === 'FORGOT_PASSWORD') {
        await api.post('/auth/reset-password', { email: tempData.email, newPassword: tempData.newPassword, otp: values.otp });
        message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        resetAllForms();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Mã xác nhận không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  // Sửa thông tin cá nhân
  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : '',
      };
      const res = await api.patch('/auth/profile', payload);
      setAuth(res.data, localStorage.getItem('staylux_token') || '');
      message.success('Cập nhật hồ sơ cá nhân thành công!');
      setOpenProfileModal(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const openProfile = () => {
    profileForm.setFieldsValue({
      fullName: user?.fullName,
      phone: user?.phone,
      birthDate: user?.birthDate ? dayjs(user.birthDate) : null,
    });
    setOpenProfileModal(true);
  };

  const resetAllForms = () => {
    setOtpMode(null);
    setForgotPasswordMode(false);
    setTempData(null);
    setActiveTab('login');
    otpForm.resetFields();
    forgotForm.resetFields();
  };

  const fillQuickAccount = (email: string) => loginForm.setFieldsValue({ email, password: '123456' });

  const roleLabels: Record<string, { text: string; color: string }> = {
    CUSTOMER: { text: 'Khách hàng', color: 'orange' },
    PARTNER: { text: 'Đối tác KS', color: 'blue' },
    ADMIN: { text: 'Quản trị viên', color: 'red' },
  };

  return (
    <header className={`sticky top-0 z-[100] ${isDark ? 'bg-[#1A1A1A] border-b border-[#303030]' : 'bg-white border-b border-[#F0EAE1]'}`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md bg-gradient-to-r from-orange-500 to-yellow-500">S</div>
          <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Stay<span className="text-orange-500">Lux</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" style={{ color: pathname === '/' ? '#FF7A00' : isDark ? '#D9D9D9' : '#4A4A4A' }}><HomeOutlined className="mr-1" /> Trang chủ</Link>
          {user && <Link href="/bookings" style={{ color: pathname === '/bookings' ? '#FF7A00' : isDark ? '#D9D9D9' : '#4A4A4A' }}><HistoryOutlined className="mr-1" /> Đặt phòng của tôi</Link>}
          {(user?.role === 'PARTNER' || user?.role === 'ADMIN') && <Link href="/partner" style={{ color: pathname === '/partner' ? '#FF7A00' : isDark ? '#D9D9D9' : '#4A4A4A' }}><ShopOutlined className="mr-1" /> Kênh Đối tác</Link>}
          {user?.role === 'ADMIN' && <Link href="/admin" style={{ color: pathname === '/admin' ? '#FF7A00' : isDark ? '#D9D9D9' : '#4A4A4A' }}><SafetyCertificateOutlined className="mr-1" /> Quản trị Admin</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <Button shape="circle" size="large" onClick={toggleTheme} icon={isDark ? <SunOutlined className="text-orange-400" /> : <MoonOutlined />} />
          {!user ? (
            <button onClick={() => { resetAllForms(); setOpenModal(true); }} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full px-6 py-2.5 font-bold shadow-md hover:opacity-90">Đăng nhập/Đăng ký</button>
          ) : (
            <Dropdown menu={{
              items: [
                { key: 'profile', icon: <EditOutlined />, label: 'Hồ sơ cá nhân', onClick: openProfile },
                { key: 'bookings', icon: <HistoryOutlined />, label: 'Lịch sử đặt phòng', onClick: () => router.push('/bookings') },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Đăng xuất', onClick: () => { logout(); router.push('/'); } },
              ],
            }}>
              <Button size="large" className="rounded-full font-semibold flex items-center gap-2">
                <UserOutlined />
                <span>{user.fullName}</span>
                <Tag color={roleLabels[user.role]?.color} className="m-0">{roleLabels[user.role]?.text}</Tag>
              </Button>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Modal Đăng nhập / Đăng ký / OTP / Quên MK */}
      <Modal open={openModal} onCancel={() => setOpenModal(false)} footer={null} title={<span className="text-xl font-bold">StayLux</span>}>
        {otpMode ? (
          <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-orange-600 mb-2">Nhập mã xác nhận (OTP)</h3>
              <p className="text-sm opacity-75">Mã OTP đã được gửi về: <b>{tempData?.email}</b><br/>(Mã có hiệu lực trong 5 phút)</p>
            </div>
            <Form.Item name="otp" rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}>
              <Input.OTP length={6} size="large" className="w-full justify-center" />
            </Form.Item>
            <Button htmlType="submit" type="primary" size="large" loading={loading} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold">Xác nhận</Button>
            <Button type="link" block onClick={resetAllForms} className="mt-2 text-gray-500">Quay lại</Button>
          </Form>
        ) : forgotPasswordMode ? (
          <Form form={forgotForm} layout="vertical" onFinish={handleForgotPasswordSubmit}>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Khôi phục mật khẩu</h3>
            <Form.Item label="Email tài khoản" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ' }]}>
              <Input size="large" placeholder="Nhập email của bạn" />
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
              <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Button htmlType="submit" type="primary" size="large" loading={loading} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold">Nhận mã OTP</Button>
            <Button type="link" block onClick={resetAllForms} className="mt-2 text-gray-500">Quay lại Đăng nhập</Button>
          </Form>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
            {
              key: 'login',
              label: 'Đăng nhập',
              children: (
                <div>
                  <div className="mb-4 p-3 rounded-lg bg-orange-50 dark:bg-zinc-800 text-xs">
                    <div className="font-semibold mb-2 text-orange-600">Tài khoản mẫu có sẵn (Mật khẩu: 123456):</div>
                    <Space wrap>
                      <Button size="small" onClick={() => fillQuickAccount('khachhang@staylux.vn')}>Khách hàng</Button>
                      <Button size="small" onClick={() => fillQuickAccount('doitac@staylux.vn')}>Đối tác KS</Button>
                      <Button size="small" onClick={() => fillQuickAccount('admin@staylux.vn')}>Admin</Button>
                    </Space>
                  </div>
                  <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                      <Input size="large" placeholder="nhap@email.vn" />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                      <Input.Password size="large" placeholder="••••••" />
                    </Form.Item>
                    <div className="flex justify-end mb-4">
                      <a className="text-orange-500 font-medium text-sm hover:underline" onClick={() => setForgotPasswordMode(true)}>Quên mật khẩu?</a>
                    </div>
                    <Button htmlType="submit" type="primary" size="large" loading={loading} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold">Đăng nhập ngay</Button>
                  </Form>
                </div>
              ),
            },
            {
              key: 'register',
              label: 'Đăng ký mới',
              children: (
                <Form form={registerForm} layout="vertical" onFinish={handleRegisterSubmit} onFinishFailed={handleRegisterFailed} initialValues={{ role: 'CUSTOMER' }}>
                  <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                    <Input size="large" placeholder="Trần Thị Ngọc Ánh" />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                    <Input size="large" placeholder="email@staylux.vn" />
                  </Form.Item>
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                      <Input size="large" placeholder="090xxxxxxx" />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="birthDate">
                      <DatePicker size="large" className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
                    </Form.Item>
                  </div>
                  <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
                    <Input.Password size="large" placeholder="Tối thiểu 6 ký tự" />
                  </Form.Item>
                  <Form.Item label="Loại tài khoản" name="role">
                    <Select size="large" options={[{ value: 'CUSTOMER', label: 'Khách hàng' }, { value: 'PARTNER', label: 'Đối tác' }]} />
                  </Form.Item>
                  <Button htmlType="submit" type="primary" size="large" loading={loading} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold">Đăng ký & Nhận mã OTP</Button>
                </Form>
              ),
            },
          ]} />
        )}
      </Modal>

      {/* Modal Sửa Hồ Sơ Cá Nhân */}
      <Modal open={openProfileModal} onCancel={() => setOpenProfileModal(false)} footer={null} title="Hồ sơ cá nhân">
        <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthDate">
            <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large" loading={loading} block className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none font-bold">Lưu thay đổi</Button>
        </Form>
      </Modal>
    </header>
  );
}