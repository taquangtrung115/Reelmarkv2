# TVS Foods — React JS

Website React giữ thiết kế xanh mint, nội dung tiếng Việt và animation từ bản Reelmark. Toàn bộ ảnh được lưu local, đặt tên tiếng Anh theo vị trí hiển thị. Website gửi liên hệ đến Google Form, Google lưu vào Sheet; không cần backend riêng.

## Chạy tại máy

Dùng Node.js 22.12+ thuộc nhánh 22.x và npm.

```sh
npm ci
npm run dev
```

Mở http://127.0.0.1:4173/. Kiểm tra và build production:

```sh
npm test
npm run test:coverage
npm run check:form
npm run build
npm run preview
```

Preview production: http://127.0.0.1:4174/. `check:form` chỉ đọc cấu hình Google để kiểm tra bảy entry ID; không gửi dữ liệu. Unit test không gửi mạng hoặc tạo phản hồi thật. Coverage HTML: `coverage/index.html`.

## Cấu trúc

```text
src/
  components/  Header, Footer, ContactForm, ProductCarousel, UI dùng chung
  pages/       Các trang React
  hooks/       Carousel, animation, metadata, media query và cleanup
  services/    Cấu hình tích hợp form
  utilities/   Route, lọc/tìm kiếm, logic carousel, Google Form mapping
  data/        31 sản phẩm, 3 bài viết, nội dung hợp tác
  styles/      Style xanh mint giữ từ bản cũ
public/assets/images/  Ảnh local có tên tiếng Anh
tests/         Vitest + React Testing Library, baseline dữ liệu/ảnh gốc
scripts/       Kiểm tra Google Form theo chế độ chỉ đọc
```

Route chính: `/`, `/about`, `/products`, `/recipes`, `/partners`, `/contact`. Trang chi tiết: `/products/premium-fish-balls`, `/recipes/air-fryer-fish-balls`. Tổng 40 trang nội dung và trang 404. Query dùng tiếng Anh: `category`, `q`, `sort`, `product`, `purpose`, `channel`.

Ví dụ `/contact?product=beef-balls&purpose=products` tự chọn đúng sản phẩm/nhu cầu. Điều hướng nội bộ dùng React Router; tải lại trang chi tiết được hỗ trợ bởi `vercel.json`.

`legacy-static/` là bản lưu cục bộ trước chuyển đổi, được gitignore. Source và test mới chạy độc lập với thư mục này; không upload nó khi deploy.

## Nhận form và xem dữ liệu

Google Form hiện đã cấu hình sẵn; không cần thêm biến môi trường để dùng form đã cung cấp. Website POST trực tiếp đến Google Forms và hiển thị phản hồi thật của Google trong khung kết quả. Không suy đoán dữ liệu đã lưu chỉ từ sự kiện iframe tải xong.

Mở [TestTVS — Câu trả lời biểu mẫu 1](https://docs.google.com/spreadsheets/d/1t3cCPcvpzbbW9OATNoQBHoI_5AgD3oZqTBwFAxaoOHc/edit#gid=1680899100). **`Trang tính1` là tab nhập tay cũ, không phải tab nhận phản hồi.** Google quản lý tab phản hồi, gồm thời gian và bảy trường liên hệ.

Ngày 07/11/2026 đã xác minh ba bản ghi `TVS React QA 20261107-01`, `-02`, `-03`. Bản `-03` được gửi từ React sau khi liên kết và xuất hiện ở dòng 4. Đây là dữ liệu kiểm thử, không phải khách hàng thật.

Hướng dẫn tạo/đổi Form và quản lý dữ liệu: [docs/GOOGLE-FORM.md](docs/GOOGLE-FORM.md).

## Public lên Vercel

Xem [docs/VERCEL.md](docs/VERCEL.md). Cấu hình sẵn: framework **Vite**, Node **22.x**, build **`npm run build`**, output **`dist`**. Chưa deploy lên tài khoản Vercel của bạn.

Nguồn ảnh: `docs/image-sources-original.json`. Runtime chỉ dùng đường dẫn mới ở `src/data/` và `public/assets/images/`. Nội dung tham khảo [Tân Việt Sin](https://tanvietsin.com/) và [TVS Fast Food](https://tvsfastfood.com/).
