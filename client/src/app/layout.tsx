import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AppProvider from '@/providers/AppProvider';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'StayLux - Đặt phòng khách sạn & khu nghỉ dưỡng cao cấp',
  description: 'Hệ thống đặt phòng khách sạn trực tuyến nhanh chóng, uy tín',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AntdRegistry>
          <AppProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-80px)]">{children}</main>
          </AppProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}