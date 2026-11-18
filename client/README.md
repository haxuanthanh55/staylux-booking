# 🏨 StayLux Booking - Nền tảng Đặt phòng Khách sạn Cao cấp

StayLux Booking là một ứng dụng web toàn diện giúp người dùng dễ dàng tìm kiếm và đặt phòng khách sạn. Hệ thống hỗ trợ 3 phân quyền riêng biệt: Khách hàng (Customer), Đối tác/Chủ khách sạn (Partner), và Quản trị viên (Admin).

## 🚀 Công nghệ sử dụng
* **Frontend:** Next.js 14, React, Tailwind CSS, Ant Design v5, TanStack Query.
* **Backend:** NestJS 10, Mongoose, Socket.IO, Nodemailer.
* **Cơ sở dữ liệu:** MongoDB Atlas (NoSQL).
* **Caching & Queue:** Redis (Docker).
* **Triển khai (Deployment):** Docker & Docker Compose.

## ✨ Tính năng nổi bật
* Xác thực OTP qua Email (hết hạn sau 5 phút), Quên mật khẩu.
* Đặt phòng với các phương thức thanh toán (Tiền mặt, Chuyển khoản, VNPAY).
* Thông báo Real-time (Socket.IO) ngay khi có đơn đặt phòng mới hoặc cập nhật trạng thái.
* Giao diện Light/Dark Mode mượt mà.
* Tính toán số phòng trống tự động.

---

## 🛠 Yêu cầu phần mềm (Prerequisites)
Để chạy được dự án này trên máy, bạn cần tải và cài đặt các phần mềm sau:
1. **[Node.js](https://nodejs.org/en/)** (Phiên bản 18.x hoặc 20.x LTS)
2. **[Git](https://git-scm.com/)** (Để tải code từ GitHub)
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Bắt buộc nếu muốn chạy bằng 1 lệnh duy nhất hoặc để chạy Redis)

---

## ⚙️ Cài đặt & Chạy dự án (Cách 1: Dùng Docker - Khuyên dùng)

Cách này sẽ tự động cài đặt mọi thứ (Frontend, Backend, Redis) chỉ với 1 lệnh duy nhất.

**Bước 1: Clone dự án về máy**
```bash
git clone https://github.com/haxuanthanh55/staylux-booking.git
cd staylux-booking
```

**Bước 2: Cấu hình biến môi trường cho Server**
Tạo một file tên là `.env` trong thư mục `server/` (`server/.env`) và dán nội dung sau vào:
```env
MONGODB_URI="mongodb+srv://babysharkkk123_db_user:RzoUJXhIQA8ILKz5@bac.yarjkvm.mongodb.net/staylux_db?retryWrites=true&w=majority"
JWT_SECRET="staylux-secret-key-2026"
PORT=4000
REDIS_URL="redis://redis:6379"
```

**Bước 3: Chạy hệ thống bằng Docker**
Mở Terminal ở thư mục gốc (`staylux-booking`) và chạy:
```bash
docker compose up -d --build
```

* **Frontend** sẽ chạy tại: `http://localhost:3000`
* **Backend** sẽ chạy tại: `http://localhost:4000`

Để tắt hệ thống:
```bash
docker compose down
```

---

## 💻 Cài đặt & Chạy dự án (Cách 2: Chạy thủ công cho Developer)

Nếu bạn muốn chỉnh sửa code và thấy kết quả ngay lập tức, hãy dùng cách này. (Yêu cầu phải bật Docker Desktop để chạy Redis trước).

**Bước 1: Khởi động Redis bằng Docker**
```bash
docker run -d --name staylux_redis -p 6379:6379 redis:7-alpine
```

**Bước 2: Cấu hình và chạy Backend (Server)**
Tạo file `server/.env` (Lưu ý REDIS_URL lúc này là localhost):
```env
MONGODB_URI="mongodb+srv://babysharkkk123_db_user:RzoUJXhIQA8ILKz5@bac.yarjkvm.mongodb.net/staylux_db?retryWrites=true&w=majority"
JWT_SECRET="staylux-secret-key-2026"
PORT=4000
REDIS_URL="redis://localhost:6379"
```
Mở Terminal mới và chạy Backend:
```bash
cd server
npm install
npm run start:dev
```

**Bước 3: Cấu hình và chạy Frontend (Client)**
Mở một Terminal khác và chạy:
```bash
cd client
npm install
npm run dev
```
Truy cập `http://localhost:3000` để sử dụng.

---

## 🔑 Tài khoản Test mặc định
(Bạn có thể click trực tiếp vào nút test nhanh trên giao diện Đăng nhập)

* **Khách hàng (Customer):** `khachhang@staylux.vn` | Mật khẩu: `123456`
* **Đối tác (Partner):** `doitac@staylux.vn` | Mật khẩu: `123456`
* **Quản trị viên (Admin):** `admin@staylux.vn` | Mật khẩu: `123456`

---

## 📁 Cấu trúc dự án
```text
staylux-booking/
├── client/              # Next.js 14 Frontend
│   ├── src/app/         # Routing pages (App Router)
│   ├── src/components/  # Tái sử dụng UI components
│   └── Dockerfile       # Đóng gói giao diện
├── server/              # NestJS 10 Backend
│   ├── src/auth/        # Logic Đăng nhập, Đăng ký, OTP
│   ├── src/hotels/      # Logic Khách sạn & Phòng
│   ├── src/bookings/    # Logic Đặt phòng
│   └── Dockerfile       # Đóng gói server
├── docker-compose.yml   # Chạy toàn bộ hệ thống
└── README.md            # Tài liệu dự án
```