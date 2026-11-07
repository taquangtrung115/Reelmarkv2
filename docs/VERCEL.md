# Public React TVS lên Vercel

## 1. Đưa source lên GitHub

Tạo repository GitHub rồi upload source ở root: `src/`, `public/`, `tests/`, `scripts/`, `docs/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.mjs`, `vercel.json`, `.gitignore`, `.env.example`, `README.md`.

Không upload `node_modules/`, `dist/`, `coverage/`, `legacy-static/`, `.codex/`, `.openai/`, `.vercel/` hoặc `.env` cá nhân. `.gitignore` đã có các mục này. Nếu dùng Git local, kiểm tra `git status` và danh sách file trước khi commit/push.

## 2. Import vào Vercel

1. Đăng nhập [Vercel](https://vercel.com/), chọn **Add New → Project**.
2. Kết nối GitHub, chọn repository vừa tạo.
3. Root Directory là thư mục chứa `package.json`.
4. Kiểm tra cấu hình:

| Mục | Giá trị |
| --- | --- |
| Framework Preset | Vite |
| Node.js Version | 22.x |
| Install Command | npm ci |
| Build Command | npm run build |
| Output Directory | dist |

5. Form hiện tại đã có URL và entry ID trong source. Không cần tạo BE, database hoặc secret; để trống Environment Variables nếu tiếp tục dùng form này.
6. Bấm **Deploy**, sau đó mở domain `.vercel.app` được cấp.

`vercel.json` có rewrite SPA để tải trực tiếp hoặc refresh `/products/beef-balls` không bị lỗi 404. Cấu hình theo [Vercel cho Vite](https://vercel.com/docs/frameworks/frontend/vite).

Các lần push vào branch production sẽ tạo deployment mới theo [tích hợp Vercel với GitHub](https://vercel.com/docs/git/vercel-for-github).

## 3. Kiểm tra sau deploy

- Mở sáu trang chính trên desktop/điện thoại, thử menu và carousel.
- Mở trực tiếp `/products/premium-fish-balls`, refresh và thử ảnh phóng to.
- Tìm `bo vien`, lọc Dimsum, đổi thứ tự, bấm xem thêm; mở bài viết và CTA sang sản phẩm.
- Mở `/contact?product=beef-balls&purpose=products`, kiểm tra lựa chọn tự điền.
- Gửi một bản `TVS Vercel QA`, xem Google báo ghi lại rồi đối chiếu dòng mới trong [tab phản hồi TestTVS](https://docs.google.com/spreadsheets/d/1t3cCPcvpzbbW9OATNoQBHoI_5AgD3oZqTBwFAxaoOHc/edit#gid=1680899100).

Kiểm thử local đã hoàn thành; bước này xác nhận domain thật sau deploy.

## Đổi Form hoặc domain

Xem [GOOGLE-FORM.md](GOOGLE-FORM.md). Có thể đặt `VITE_GOOGLE_FORM_URL` ở **Project → Settings → Environment Variables** rồi redeploy. Chỉ dùng URL đầy đủ `/viewform`; form khác cần entry ID tương ứng trong `src/utilities/google-form.js`.

`VITE_` được đóng vào JavaScript công khai; không dùng cho mật khẩu, private key hoặc thông tin truy cập Sheet. Xem [biến môi trường Vercel](https://vercel.com/docs/environment-variables).

Domain riêng: **Project → Settings → Domains**, thêm tên miền rồi làm theo bản ghi DNS Vercel hiển thị.
