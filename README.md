# JoHap Website

JoHap (Joy and Happiness Canteen) là một hệ thống quản lý căn tin hiện đại, mang đến sự tiện lợi và hiệu quả trong việc quản lý và phục vụ. Dưới đây là hướng dẫn chi tiết để cài đặt và chạy dự án JoHap trên máy của bạn.

---

## 🚀 Chạy dự án

JoHap được chia thành hai phần chính:

1. **Frontend (FE)**: Giao diện người dùng, phát triển bằng React.
2. **Backend (BE)**: Máy chủ API, phát triển bằng Node.js.

### 1. Chạy Frontend

Truy cập vào thư mục `client` và chạy các lệnh sau:

```bash
cd client
npm install
npm start
```

- Frontend sẽ được khởi chạy tại [http://localhost:3000](http://localhost:3000).

### 2. Chạy Backend

Truy cập vào thư mục `server` và chạy các lệnh sau:

```bash
cd server
npm install
npm start
```

- Backend sẽ được khởi chạy tại [http://localhost:8000](http://localhost:8000).

---

## 📂 Cấu trúc thư mục

```plaintext
JoHap/
├── client/        # Mã nguồn giao diện người dùng (Frontend)
├── server/        # Mã nguồn máy chủ API (Backend)
├── README.md      # Tài liệu mô tả dự án
```

---

## 💡 Tính năng nổi bật

- **Quản lý thực đơn:** Dễ dàng thêm, sửa, xóa các món ăn và đồ uống.
- **Quản lý đơn hàng:** Theo dõi và xử lý đơn hàng nhanh chóng.
- **Thống kê chi tiết:** Báo cáo doanh thu và hiệu suất hoạt động căn tin.
- **Giao diện hiện đại:** Thân thiện với người dùng, tương thích với nhiều thiết bị.

---

## 📋 Yêu cầu hệ thống

- **Node.js** phiên bản >= 14.x
- **npm** phiên bản >= 6.x
- Trình duyệt hiện đại (Chrome, Firefox, Edge, ...).

---

## 🔑 Tài khoản đăng nhập

Hệ thống hỗ trợ ba role người dùng khác nhau, mỗi role có tài khoản và mật khẩu riêng:

- Role: Student
```plaintext
Username: student
Password: student
```
- Role: Staff
```plaintext
Username: staff
Password: staff
```
- Role: Admin
```plaintext
Username: admin
Password: admin
```
---
## 💡 Công nghệ sử dụng

- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Các công cụ khác:** npm, Postman (kiểm thử API), Git

---

## 🤝 Hướng dẫn đóng góp

1. Fork dự án về máy cá nhân của bạn.
2. Tạo nhánh mới cho tính năng hoặc sửa lỗi.
3. Sau khi hoàn thành, gửi Pull Request mô tả chi tiết về các thay đổi.
4. Các thay đổi sẽ được xem xét và merge vào nhánh chính.

---

## 📞 Liên hệ hỗ trợ

Nếu có bất kỳ câu hỏi hoặc vấn đề nào, vui lòng liên hệ với chúng tôi qua email: [johapsystem@gmail.com](mailto:johapsystem@gmail.com).

---

🌟 **Cảm ơn bạn đã sử dụng JoHap - Nơi mang lại niềm vui và hạnh phúc trong từng bữa ăn!**

