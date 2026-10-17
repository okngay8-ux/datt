# Luyện Nghe Nói EPS-TOPIK & Chuyển Văn Bản Tiếng Hàn Sang Giọng Đọc Bản Địa

Ứng dụng web luyện thi vấn đáp EPS-TOPIK và chuyển văn bản tiếng Hàn sang giọng đọc chuẩn phát thanh viên Seoul (Edge Neural Voice), tích hợp chỉnh tốc độ, ngắt nghỉ câu, trộn ngẫu nhiên, lưu bộ câu hỏi và tương thích hoàn hảo trên điện thoại.

## ✨ Tính năng nổi bật

1. **Giọng đọc AI tiếng Hàn bản địa:** Sử dụng các giọng đọc chất lượng cao (`Sun-Hi`, `In-Joon`, `Hyunsu`) với âm điệu truyền cảm, tự nhiên.
2. **Luyện thi EPS-TOPIK thực tế:** Giao diện tối chuyên nghiệp mô phỏng phòng thi vấn đáp, hiển thị câu hỏi, dịch nghĩa tiếng Việt, khung trả lời và trạng thái đếm ngược.
3. **Tùy chỉnh độ trễ & Reset thông minh:** Cài đặt thời gian chờ giữa câu hỏi và câu trả lời (`1s - 15s`). Khi bấm Next câu, độ trễ được reset ngay lập tức.
4. **Tải file âm thanh MP3:** Cho phép tải MP3 từng câu hoặc toàn bộ bài học (ghép sẵn độ trễ) về máy tính/điện thoại.
5. **Quản lý & Lưu bộ câu hỏi:** Lưu trữ nhiều bộ câu hỏi khác nhau, đổi tên, xóa, xuất/nhập file JSON sao lưu.
6. **Dùng tốt trên điện thoại (PWA):** Tối ưu giao diện mobile, quét mã QR kết nối nhanh, hỗ trợ "Thêm vào màn hình chính" dùng như ứng dụng thật.

## 🚀 Cài đặt & Chạy cục bộ (Local)

1. Cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+).
2. Tải mã nguồn về máy:
   ```bash
   git clone https://github.com/<tai-khoan-cua-ban>/korean-tts-web.git
   cd korean-tts-web
   ```
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
4. Khởi động ứng dụng:
   ```bash
   npm start
   ```
5. Mở trình duyệt tại: `http://localhost:3000` (hoặc nhấp đúp file `start.bat` trên Windows).

## 🌐 Triển khai Online miễn phí (Để mọi người cùng truy cập)

Xem hướng dẫn chi tiết bên dưới để đưa lên **Render.com** hoặc **Railway** chỉ với vài thao tác kết nối với GitHub.
