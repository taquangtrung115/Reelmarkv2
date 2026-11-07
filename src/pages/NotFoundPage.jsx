import { ButtonLink } from "../components/Shared.jsx";
import { routes } from "../utilities/routes.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
const NotFoundPage = () => {
  usePageMeta("Không tìm thấy trang");
  return (
    <section className="error-page">
      <div className="handnote" aria-hidden="true">
        Ôi, lạc vào bếp rồi!
      </div>
      <h1>Trang này chưa có món.</h1>
      <p>
        Quay về trang chủ hoặc khám phá danh mục để tìm món ngon bạn yêu thích.
      </p>
      <ButtonLink to={routes.home}>Về trang chủ</ButtonLink>
    </section>
  );
};
export default NotFoundPage;
