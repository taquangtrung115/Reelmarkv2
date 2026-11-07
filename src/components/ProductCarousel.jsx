import { useRef } from "react";
import { Link } from "react-router-dom";
import products from "../data/products.json";
import { useCarousel } from "../hooks/useCarousel.js";
import { routes } from "../utilities/routes.js";
import Icon from "./Icon.jsx";

const slugs = [
  "seafood-spring-rolls",
  "pork-shrimp-siu-mai",
  "mini-round-sausages",
  "premium-fish-balls",
  "pork-shrimp-dumplings",
  "ha-long-squid-cakes",
  "beef-balls",
  "fresh-shrimp-har-gow",
  "shrimp-filled-fish-balls",
  "cheese-filled-surimi-balls",
];
const items = slugs.map((slug) =>
  products.find((product) => product.slug === slug),
);
const ProductCarousel = () => {
  const ref = useRef(null);
  const { paused, togglePaused } = useCarousel(ref, items.length);
  return (
    <section className="carousel-wrap" aria-label="Món ngon Tân Việt Sin">
      <div
        ref={ref}
        className="carousel"
        tabIndex={0}
        role="region"
        aria-roledescription="băng chuyền"
        aria-label="10 món ngon. Kéo hoặc dùng phím mũi tên để khám phá."
        aria-describedby="carousel-help"
      >
        <ul className="carousel-list">
          {items.map((product) => (
            <li className="product" key={product.slug}>
              <Link
                to={routes.product(product.slug)}
                aria-label={`Xem sản phẩm ${product.name}`}
              >
                <img
                  src={`/assets/images/hero/hero-${product.slug}.png`}
                  alt={product.name}
                  width="600"
                  height="600"
                  draggable={false}
                  decoding="async"
                />
                <span className="product-label">
                  <Icon name="arrow" />
                  <span>{product.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="carousel-toolbar">
        <span aria-hidden="true">⟷</span>
        <span id="carousel-help">Kéo nhẹ, chọn món bạn mê</span>
        <button
          className="motion-toggle"
          type="button"
          aria-label={paused ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}
          aria-pressed={paused}
          onClick={togglePaused}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d={paused ? "M5 3l8 5-8 5z" : "M4 3h3v10H4zm5 0h3v10H9z"} />
          </svg>
        </button>
      </div>
    </section>
  );
};
export default ProductCarousel;
