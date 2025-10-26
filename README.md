# UTE Shop — Frontend

Ngắn gọn: đây là frontend (React + Vite) cho đồ án cửa hàng trực tuyến UTE Shop. Ứng dụng hỗ trợ: duyệt sản phẩm, giỏ hàng, đặt hàng, quản trị (Admin) với danh sách đơn hàng, chat realtime (user ↔ support), upload ảnh/video trong chat, xác thực OTP, và các tính năng thường gặp của e‑commerce.

## Tổng quan tính năng
- Trang khách:
  - Danh sách & tìm kiếm sản phẩm, trang chi tiết sản phẩm.
  - Giỏ hàng, thanh toán, lịch sử đơn hàng.
  - Đăng ký / đăng nhập / xác thực OTP / quên mật khẩu.
  - Yêu thích sản phẩm, xem gần đây.
  - Widget chat khách hàng (gửi text, ảnh, video).
- Admin:
  - Dashboard, quản lý sản phẩm / danh mục / voucher / người dùng.
  - Danh sách đơn hàng với thay đổi trạng thái theo bước (không cho hủy khi đã hoàn thành).
  - Giao diện chat admin cho từng hội thoại (upload ảnh/video, scroll, mark read).
- Realtime:
  - Chat sử dụng socket.io (namespace `/chat`), nhận tin realtime và dedupe message.

## Kiến trúc & cấu trúc thư mục chính
- src/
  - api/ — service gọi API (axios wrapper, conversation/api ...)
  - components/ — các component tái sử dụng (ChatWidget.jsx, AdminChatBox.jsx, Input, Button ...)
  - components/admin — UI dành cho admin (AdminChatList/Box/Page, AdminOrderList ...)
  - features/ — redux slices (auth, otp, adminOrder, product, cart, ...)
  - pages/ — các route page (Home, Product, VerifyOTP, AdminPage, ...)
  - service/ — API helpers, socket service (chatSocketService.js, socketService.js)
  - utils/ — helper (order utils, toast)
- index, store, css (global) theo chuẩn React + Redux.

## Yêu cầu hệ thống
- Node.js >= 16
- npm / pnpm / yarn

## Biến môi trường (ví dụ)
- VITE_API_URL — base API server (ví dụ `http://localhost:5000`)
- VITE_IMAGE_URL — base cho media nếu khác API
- (token lưu localStorage)

## Cài đặt & chạy
1. Cài dependencies:
   - npm install
2. Chạy dev:
   - npm run dev
3. Build:
   - npm run build
4. Preview build:
   - npm run preview

(Commands có thể khác tuỳ package.json. Kiểm tra package.json trước khi chạy.)

## Socket / Chat
- Socket URL mặc định: `http://localhost:5000/chat` (xem trong ChatWidget.jsx, AdminChatBox.jsx).
- Khi gửi message: gửi qua REST API `sendMessage(fd)` và server có thể emit `new_message`.
- Đã bổ sung cơ chế dedupe: kiểm tra id / sender+content+timestamp / media filename để tránh lặp message trên client.

## Lưu ý triển khai
- Upload media (image/video) dùng FormData với field `media`, `type` ("IMAGE"/"VIDEO") và `conversationId`.
- Khi mở chat: client tự scroll xuống cuối và gọi mark read (cả local + emit socket / gọi API).
- Trạng thái đơn hàng: AdminOrderList có logic cho phép chuyển trạng thái chỉ tiến 1 bước (ngoại trừ huỷ) và không cho thay đổi nếu đã DELIVERED/CANCELLED.

## Debug & tips
- Nếu thấy message lặp: kiểm tra server có emit sau khi respond REST; client đã có dedupe logic — ideal là server trả message id trong response hoặc không emit lại cho người gửi.
- Nếu không hiển thị media: kiểm tra VITE_IMAGE_URL / base URL, và preview sử dụng URL.createObjectURL cho file tạm.
- JWT decode: dùng jwt-decode với fallback safe decode (đã có helper trong code).

## Góp ý & phát triển
- Thêm unit tests cho slices và components.
- Nâng cấp UI/UX: lazy load ảnh, limit video size, compress upload.
- Nâng cao security: refresh token, rate limit chat, validate file types/sizes.

## License
- Mã nguồn nội bộ đồ án — ghi chú bản quyền theo quy định đơn vị (nếu cần, thêm LICENSE).
