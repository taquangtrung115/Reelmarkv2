# Kết quả kiểm tra React — 07/11/2026

## Tự động

- `npm run test:coverage`: **144 test / 5 file đều thành công**.
- Coverage JavaScript/JSX trong `src/`, trừ entry bootstrap `main.jsx`: **95.61% dòng, 94.92% statements, 88.92% nhánh, 89.06% hàm**. Đây không phải coverage CSS hoặc dịch vụ Google bên ngoài.
- Test kiểm tra cả 40 route nội dung và 404; tên/nội dung sản phẩm và SHA-256 của ảnh đối chiếu baseline trước chuyển đổi.
- Tương tác được test: tìm kiếm không dấu, filter/sort, phân trang, gallery/dialog, menu, tab hợp tác, CTA/context, drag/keyboard/pause carousel, observer/animation cleanup, reduced motion, mapping form, validation, chặn submit lặp, timeout và email fallback.
- Test không phụ thuộc thư mục lưu cũ `legacy-static/` và không gửi mạng.
- `npm run check:form`: Form công khai truy cập được, đúng bảy entry ID và POST endpoint; chỉ đọc, không gửi dữ liệu.
- `npm run build`: thành công.

## Trình duyệt Chrome

- Mở trực tiếp và cuộn tới cuối **41 đường dẫn** (40 nội dung + 404) ở desktop; kiểm tra heading, ảnh local, link và trạng thái animation.
- Kiểm tra chín loại trang ở **320/375/414/768px**: 36 trường hợp, không có tràn ngang.
- Thử menu điện thoại, tìm `bo vien`, tải đủ 31 sản phẩm, lọc còn chín Dimsum, đổi/phóng ảnh, CTA tư vấn giữ context.
- Thử ba tab hợp tác và ảnh tương ứng, FAQ, CTA bài viết sang đúng category.
- Bản production chạy bằng `npm run preview`: mở trực tiếp và refresh `/products/premium-fish-balls`, CTA sang contact chọn đúng sản phẩm; carousel pause/keyboard chạy, không ghi nhận console error trong các bước này.
- Ảnh lazy trong tab hợp tác đang ẩn chưa tải là hành vi dự kiến; sau khi mở từng tab, cả ba ảnh tải đúng.

Ảnh chụp và dữ liệu kiểm tra chi tiết lưu cục bộ trong `.codex/react-qa/`.

## Google Form → Google Sheet thật

Đã liên kết Form với TestTVS bằng giao diện Google Forms. Google tạo tab **Câu trả lời biểu mẫu 1**, gid **1680899100**; tab `Trang tính1` nhập tay được giữ nguyên.

Hai bản thử `TVS React QA 20261107-01` và `-02` đã được chuyển vào tab phản hồi. Sau khi liên kết, gửi thêm **TVS React QA 20261107-03** từ website React: Google xác nhận ghi lại và bản ghi tự xuất hiện ở **dòng 4**, lúc **17:28:59 ngày 07/11/2026**. Kiểm tra bằng trình duyệt, không chèn dữ liệu trực tiếp vào Sheet.

[Mở tab phản hồi đã xác minh](https://docs.google.com/spreadsheets/d/1t3cCPcvpzbbW9OATNoQBHoI_5AgD3oZqTBwFAxaoOHc/edit#gid=1680899100).

## Phạm vi

Đã kiểm tra local và dịch vụ Google thật. Chưa deploy Vercel hoặc kiểm tra domain production của người dùng. Sau deploy cần gửi một bản kiểm thử có nhãn riêng để xác nhận trên domain mới, theo `VERCEL.md`. Không có thay đổi quyền chia sẻ Sheet trong quá trình xử lý.
