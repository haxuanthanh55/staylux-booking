'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Rate, Tag, Empty, Spin, Card } from 'antd';
import {
  EnvironmentOutlined,
  SearchOutlined,
  FireFilled,
  SafetyCertificateFilled,
  CustomerServiceFilled,
  ThunderboltFilled,
} from '@ant-design/icons';
import { api } from '@/lib/api';
import { useApp } from '@/providers/AppProvider';

export default function HomePage() {
  const { isDark } = useApp();
  const [city, setCity] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [starRating, setStarRating] = useState<string>('');

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels', city, keyword, maxPrice, starRating],
    queryFn: async () => {
      const params: any = {};
      if (city) params.city = city;
      if (keyword) params.keyword = keyword;
      if (maxPrice) params.maxPrice = maxPrice;
      if (starRating) params.starRating = starRating;
      const res = await api.get('/hotels', { params });
      return res.data;
    },
  });

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  return (
    <div className="pb-16">
      {/* 1. HERO SECTION */}
      <section
        className="relative py-16 px-4"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1F1A16 0%, #141414 100%)'
            : 'linear-gradient(135deg, #FFF3E4 0%, #FAF7F2 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <Tag color="orange" className="mb-3 px-3 py-1 text-sm font-semibold rounded-full">
              <FireFilled /> HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN & RESORT
            </Tag>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Tìm và đặt phòng khách sạn lý tưởng cho chuyến đi của bạn
            </h1>
            <p className="text-base opacity-80">
              Trải nghiệm kỳ nghỉ trọn vẹn tại Hà Nội, Đà Nẵng, Huế, TP. Hồ Chí Minh với mức giá ưu đãi nhất trên StayLux.
            </p>
          </div>

          {/* Thanh tìm kiếm */}
          <div
            className="p-4 md:p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4"
            style={{ backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }}
          >
            <div>
              <div className="text-xs font-bold mb-1 opacity-70">ĐỊA ĐIỂM / THÀNH PHỐ</div>
              <Select
                size="large"
                className="w-full"
                placeholder="Tất cả thành phố"
                allowClear
                value={city || undefined}
                onChange={(val) => setCity(val || '')}
                options={[
                  { value: 'Hà Nội', label: 'Hà Nội' },
                  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                  { value: 'Huế', label: 'Huế' },
                  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                ]}
              />
            </div>

            <div>
              <div className="text-xs font-bold mb-1 opacity-70">TÊN KHÁCH SẠN / ĐỊA CHỈ</div>
              <Input
                size="large"
                prefix={<SearchOutlined className="text-orange-500" />}
                placeholder="Nhập tên khách sạn, đường..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
              />
            </div>

            <div>
              <div className="text-xs font-bold mb-1 opacity-70">MỨC GIÁ TỐI ĐA / ĐÊM</div>
              <Select
                size="large"
                className="w-full"
                placeholder="Mọi mức giá"
                allowClear
                value={maxPrice || undefined}
                onChange={(val) => setMaxPrice(val || '')}
                options={[
                  { value: '1500000', label: 'Dưới 1.500.000 ₫' },
                  { value: '2000000', label: 'Dưới 2.000.000 ₫' },
                  { value: '3000000', label: 'Dưới 3.000.000 ₫' },
                ]}
              />
            </div>

            <div>
              <div className="text-xs font-bold mb-1 opacity-70">TIÊU CHUẨN SAO</div>
              <Select
                size="large"
                className="w-full"
                placeholder="Tất cả hạng sao"
                allowClear
                value={starRating || undefined}
                onChange={(val) => setStarRating(val || '')}
                options={[
                  { value: '5', label: '⭐⭐⭐⭐⭐ (5 sao)' },
                  { value: '4', label: '⭐⭐⭐⭐ (4 sao)' },
                  { value: '3', label: '⭐⭐⭐ (3 sao)' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DANH SÁCH KHÁCH SẠN NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold">Khách sạn nổi bật</h2>
            <p className="text-sm opacity-70">
              Hiển thị {hotels.length} khách sạn đã được kiểm duyệt chất lượng
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <Spin size="large" />
          </div>
        ) : hotels.length === 0 ? (
          <Empty description="Không tìm thấy khách sạn phù hợp với bộ lọc" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel: any) => (
              <Card
                key={hotel._id}
                hoverable
                className="overflow-hidden rounded-2xl shadow-sm border-0 flex flex-col justify-between"
                styles={{ body: { padding: 20 } }}
                cover={
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Tag
                      color="orange"
                      className="absolute top-3 left-3 font-bold px-3 py-1 rounded-full border-0 shadow"
                    >
                      {hotel.city}
                    </Tag>
                  </div>
                }
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Rate disabled defaultValue={hotel.starRating || 5} className="text-sm text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{hotel.name}</h3>
                  <p className="text-xs opacity-75 mb-3 flex items-center gap-1">
                    <EnvironmentOutlined className="text-orange-500" /> {hotel.address}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(hotel.amenities || []).slice(0, 3).map((am: string, idx: number) => (
                      <Tag key={idx} className="text-xs m-0">
                        {am}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-60">Giá chỉ từ</div>
                    <div className="text-lg font-extrabold" style={{ color: '#FF6B00' }}>
                      {formatVND(hotel.minPrice)} <span className="text-xs font-normal">/ đêm</span>
                    </div>
                  </div>
                  <Link href={`/hotels/${hotel._id}`}>
                    <button
                      style={{
                        background: 'linear-gradient(90deg, #FF6B00 0%, #FFA800 100%)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '8px 20px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Chọn phòng
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 3. CAM KẾT DỊCH VỤ (FEATURES / CTA) */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div
          className="rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{
            backgroundColor: isDark ? '#1E1E1E' : '#FFF4E6',
          }}
        >
          <div className="flex items-start gap-4">
            <ThunderboltFilled className="text-3xl text-orange-500 mt-1" />
            <div>
              <h4 className="font-bold text-base mb-1">Xác nhận đặt phòng tức thì</h4>
              <p className="text-sm opacity-75">
                Hệ thống thông báo realtime trực tiếp tới khách sạn ngay khi bạn hoàn tất đặt phòng.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <SafetyCertificateFilled className="text-3xl text-orange-500 mt-1" />
            <div>
              <h4 className="font-bold text-base mb-1">100% Khách sạn được kiểm duyệt</h4>
              <p className="text-sm opacity-75">
                Mọi đối tác trên StayLux đều được Quản trị viên xác minh thông tin và chất lượng phòng.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CustomerServiceFilled className="text-3xl text-orange-500 mt-1" />
            <div>
              <h4 className="font-bold text-base mb-1">Linh hoạt & Không phí ẩn</h4>
              <p className="text-sm opacity-75">
                Giá hiển thị minh bạch theo đêm, hỗ trợ hủy phòng miễn phí khi đơn đang chờ xác nhận.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}