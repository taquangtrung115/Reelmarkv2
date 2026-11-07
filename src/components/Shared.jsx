import { Fragment } from "react";
import { Link } from "react-router-dom";
import { routes } from "../utilities/routes.js";
import Icon from "./Icon.jsx";

export const Badge = ({ children, heart = false }) => (
  <span className="badge">
    {heart && <Icon name="heart" />}
    {children}
  </span>
);
export const ButtonLink = ({ children, to, variant = "green" }) => (
  <Link className={`pill pill--${variant}`} to={to}>
    {children}
    <Icon name="arrow" />
  </Link>
);
export const HeadingLines = ({ lines }) =>
  lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
export const Breadcrumbs = ({ items }) => (
  <nav className="breadcrumb" aria-label="Đường dẫn">
    <Link to={routes.home}>Trang chủ</Link>
    {items.map((item) => (
      <Fragment key={item.label}>
        <Icon name="chevron" />
        {item.to ? (
          <Link to={item.to}>{item.label}</Link>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
      </Fragment>
    ))}
  </nav>
);
export const Callout = ({
  children,
  label = "Khám phá sản phẩm",
  to = routes.products,
}) => (
  <section className="quote-block section" data-reveal>
    <h2>{children}</h2>
    <ButtonLink to={to}>{label}</ButtonLink>
  </section>
);
export const ProductCard = ({ product }) => (
  <article
    className="food-card"
    data-name={product.name}
    data-group={product.category}
  >
    <Link to={routes.product(product.slug)}>
      <div className="food-card-media">
        <img
          src={product.images[0]}
          alt={product.name}
          width="600"
          height="600"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="food-card-meta">
        <div>
          <h3>{product.name}</h3>
          <p>{product.categoryName}</p>
        </div>
        <span className="circle-arrow">
          <Icon name="arrow" />
        </span>
      </div>
    </Link>
  </article>
);
export const ProductGrid = ({ products }) => (
  <div className="product-grid">
    {products.map((product) => (
      <ProductCard product={product} key={product.slug} />
    ))}
  </div>
);
