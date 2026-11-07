# Form liên hệ không cần backend riêng

## Cấu hình hiện tại

- [Google Form công khai](https://docs.google.com/forms/d/e/1FAIpQLScteoJPEL9WWLHUgYZeKCZE-yfRCZfAMtGrWie7aaz2K_cAhQ/viewform).
- [Sheet — Câu trả lời biểu mẫu 1](https://docs.google.com/spreadsheets/d/1t3cCPcvpzbbW9OATNoQBHoI_5AgD3oZqTBwFAxaoOHc/edit#gid=1680899100).
- HTML POST gửi trực tiếp đến Google Forms. Google quản lý lưu trữ/đồng bộ Sheet.
- Admin mở Sheet để xem, tìm, lọc hoặc tải dữ liệu; không cần trang admin riêng.

Sheet trống trước đó vì Form đã nhận hai phản hồi nhưng chưa liên kết bảng tính. Sau khi chọn TestTVS làm đích, Google tạo tab **Câu trả lời biểu mẫu 1** và chuyển phản hồi cũ vào. Bản thử thứ ba xác nhận dữ liệu mới được tự ghi lại.

## Tạo lại hoặc đổi Form

1. Tạo bảy câu hỏi: họ tên, email, điện thoại, đơn vị/khu vực, nhu cầu, sản phẩm, lời nhắn. Dùng loại **Trả lời ngắn** hoặc **Đoạn**; website hiện gửi nhu cầu/sản phẩm dưới dạng văn bản.
2. Cho phép khách trả lời công khai. Không bật giới hạn một lần trả lời hoặc bắt đăng nhập nếu muốn khách gửi không cần tài khoản Google.
3. Trong **Phản hồi**, bấm biểu tượng Sheets → tạo bảng tính mới/chọn bảng tính hiện có. Google tạo tab riêng; nhập tiêu đề thủ công không thay thế việc liên kết.
4. Xuất bản/chia sẻ Form, lấy URL công khai `/viewform`.
5. Dùng **Lấy đường liên kết điền sẵn** để xác định `entry.<số>` từng câu hỏi; thay URL và bảy entry ID trong `src/utilities/google-form.js`. Không dùng ID câu hỏi/Sheet thay entry ID.
6. Chạy `npm run check:form`, `npm test`, `npm run build`.
7. Gửi một bản có tên kiểm thử từ website, kiểm tra xác nhận Google và dòng mới trong Sheet. Unit test chỉ kiểm tra mapping/validation/trạng thái, không thay cho kiểm thử lưu thật.

Tham khảo [Google: nơi lưu câu trả lời](https://support.google.com/docs/answer/2917686?hl=vi) và [xuất bản/chia sẻ Form](https://support.google.com/docs/answer/2839588?hl=vi).

## Trạng thái gửi

Nút gửi bị khoá trong khi đang gửi. Form giữ nguyên nội dung nếu cần thử lại. Khung kết quả hiển thị phản hồi trực tiếp của Google; đọc xác nhận **“Câu trả lời của bạn đã được ghi lại.”** Nếu Google từ chối hoặc yêu cầu đăng nhập, phản hồi thực xuất hiện trong khung.

Trình duyệt không được đọc nội dung cross-origin của Google. Source không coi `iframe.onload` hoặc `fetch no-cors` là bằng chứng lưu Sheet. Quá 20 giây chưa tải phản hồi, giao diện cho biết chưa nhận được kết quả và mở lại nút gửi; kiểm tra Sheet trước khi thử lại để tránh trùng.

Muốn nhận email thông báo: chủ Form mở **Phản hồi → menu ⋮ → Nhận thông báo qua email về câu trả lời mới**.

## Quản lý dữ liệu

Sheet hiện chia sẻ bằng liên kết. Trước khi thu thông tin khách thật, chủ Sheet nên đổi **Quyền truy cập chung → Bị hạn chế**, rồi cấp quyền cho admin cần xem. Website không cần quyền đọc Sheet hoặc chứa URL Sheet trong bundle, nên hạn chế Sheet không làm hỏng việc gửi Form. Giữ quyền trả lời Form phù hợp với khách hàng.

Không xoá/tạo lại câu hỏi mà quên cập nhật entry ID. Nếu ngừng nhận phản hồi hoặc đổi quyền Form, kiểm thử lại. Google Forms là dịch vụ bên ngoài; kết quả gửi phụ thuộc kết nối và quyền truy cập của Google.
