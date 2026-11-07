import { useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import Icon from "../components/Icon.jsx";
import { useHeroEntrance } from "../hooks/useHeroEntrance.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { routes } from "../utilities/routes.js";

const HomePage = () => {
  const frameRef = useRef(null);
  useHeroEntrance(frameRef);
  usePageMeta("Trọn vị ngon, trọn yêu thương");
  return (
    <div className="home-page">
      <div className="viewport">
        <div className="frame" ref={frameRef}>
          <Header home />
          <main id="main">
            <div className="hero-copy">
              <div className="badge">
                <Icon name="heart" />
                Vị ngon thân quen từ năm 2002
              </div>
              <h1>
                <span>Trọn vị ngon,</span>
                <span>trọn yêu thương.</span>
              </h1>
              <p className="subline">
                <span>Từ bò viên, cá viên đến chả giò và dimsum,</span>{" "}
                <span>
                  Tân Việt Sin mang món ngon tiện lợi đến từng bữa ăn.
                </span>{" "}
                <span>Để mỗi lần quây quần, thêm một lần ngon.</span>
              </p>
            </div>
            <svg
              className="doodle doodle--ticks"
              viewBox="0 0 45 50"
              aria-hidden="true"
            >
              <path d="m7 36 14-26m0 31 15-24" />
            </svg>
            <div className="note note--food" aria-hidden="true">
              <span>Món ngon,</span>
              <span>nhà mình mê!</span>
            </div>
            <svg
              className="doodle doodle--food"
              viewBox="0 0 145 125"
              aria-hidden="true"
            >
              <path d="M49 5c46 8 62 40 46 62-15 19-43 17-52 4-9-14 2-24 15-20 24 8 20 41-24 65m0-18-3 20 21-6" />
            </svg>
            <ProductCarousel />
            <div className="note note--action" aria-hidden="true">
              Cùng chọn
              <br /> món ngon!
            </div>
            <svg
              className="doodle doodle--action"
              viewBox="0 0 55 44"
              aria-hidden="true"
            >
              <path d="M4 29c13 13 34 10 43-14m-14 2 16-6-1 17" />
            </svg>
            <div className="hero-action">
              <div className="cta-ring">
                <Link className="pill pill--green" to={routes.products}>
                  Khám phá món ngon
                  <Icon name="arrow" />
                </Link>
              </div>
              <Link className="partner-link" to={routes.partners}>
                Bạn muốn phân phối thực phẩm? Kết nối cùng TVS ↗
              </Link>
            </div>
          </main>
          <footer className="footer">
            <span>Tân Việt Sin Foods · Người bạn đồng hành của mọi nhà</span>
            <div className="footer-links">
              <Link to={routes.about}>Câu chuyện TVS</Link>
              <Link to={routes.contact}>Kết nối cùng chúng tôi ↗</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
