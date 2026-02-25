# SEO Task Pro - Nền tảng làm nhiệm vụ kiếm tiền online

SEO Task Pro là một ứng dụng web hiện đại cho phép người dùng kiếm tiền bằng cách thực hiện các nhiệm vụ SEO (tìm kiếm từ khóa, truy cập website). Hệ thống được tích hợp đầy đủ các tính năng từ quản lý người dùng, nạp tiền game, rút tiền đến bảng điều khiển dành cho quản trị viên.

## ✨ Tính năng chính

### 👤 Dành cho người dùng
- **Đăng ký & Đăng nhập**: Hệ thống xác thực email với mã OTP 6 số.
- **Nhiệm vụ SEO**: Thực hiện các bước tìm kiếm Google, lấy mã xác nhận để nhận thưởng.
- **Rút tiền**: Hỗ trợ rút tiền về tài khoản ngân hàng (VietinBank, Vietcombank, MB Bank, v.v.).
- **Nạp Game**: Nạp tiền trực tiếp vào các game phổ biến (Liên Quân, Free Fire, PUBG Mobile).
- **Giới thiệu**: Hệ thống referral nhận hoa hồng khi mời bạn bè.
- **Hồ sơ**: Quản lý thông tin cá nhân và lịch sử giao dịch.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Tổng quan**: Theo dõi thống kê doanh thu, người dùng và nhiệm vụ.
- **Quản lý người dùng**: Xem danh sách, tìm kiếm, xóa người dùng và điều chỉnh số dư.
- **Quản lý nhiệm vụ**: Thêm mới, xóa và theo dõi tiến độ các nhiệm vụ SEO.
- **Duyệt giao dịch**: Phê duyệt hoặc từ chối các yêu cầu rút tiền và nạp game.
- **Thông báo**: Gửi thông báo nổi bật đến toàn bộ người dùng.

## 🚀 Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS 4.
- **Animations**: Motion (Framer Motion).
- **Icons**: Lucide React.
- **State Management**: React Context API.
- **Storage**: LocalStorage (Dữ liệu được lưu trữ trực tiếp trên trình duyệt).

## 🛠️ Hướng dẫn cài đặt

1. **Clone dự án**:
   ```bash
   git clone https://github.com/your-username/seo-task-pro.git
   cd seo-task-pro
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Chạy môi trường phát triển**:
   ```bash
   npm run dev
   ```

4. **Build dự án**:
   ```bash
   npm run build
   ```

## 🔐 Tài khoản Admin mặc định

- **Email**: `usernthd2207@gmail.com`
- **Mật khẩu**: `admin2009`

## 📝 Lưu ý

- Ứng dụng hiện đang sử dụng `localStorage` để lưu trữ dữ liệu, phù hợp cho việc demo và thử nghiệm. Để triển khai thực tế, cần kết nối với một cơ sở dữ liệu backend (Node.js, Firebase, v.v.).
- Tính năng gửi email xác thực đang ở chế độ mô phỏng. Bạn có thể cấu hình EmailJS trong file `src/pages/Register.tsx` để sử dụng thực tế.

## 📄 Giấy phép

Dự án này được cấp phép theo giấy phép MIT.
