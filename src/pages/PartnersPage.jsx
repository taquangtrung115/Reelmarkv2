import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import partners from "../data/partners.json";
import products from "../data/products.json";
import {
  Badge,
  ButtonLink,
  Callout,
  HeadingLines,
} from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
import { routes } from "../utilities/routes.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const PartnersPage = () => {
  usePageMeta("Cùng đưa vị ngon đi xa hơn");
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      partners.findIndex((item) => item.key === params.get("channel")),
    ),
  );
  const refs = useRef([]);
  const selectFromKey = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? partners.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + partners.length) %
            partners.length;
    setSelected(next);
    refs.current[next]?.focus();
  };
  return (
    <>
      <section className="partner-hero">
        <div data-enter>
          <Badge>Kết nối cùng TVS Fast Food</Badge>
          <h1>
            Cùng đưa vị ngon
            <br />
            <span className="display-accent">đi xa hơn.</span>
          </h1>
          <p>
            Từ nguồn hàng đến thị trường, từ một cửa hàng đến nhiều điểm bán.
            <br />
            Mỗi kết nối mở ra một cơ hội để cùng phát triển.
          </p>
        </div>
        <div className="partner-ribbon" data-enter>
          {["seafood-spring-rolls", "beef-balls", "fresh-shrimp-har-gow"].map(
            (slug) => {
              const product = products.find((item) => item.slug === slug);
              return (
                <figure key={slug}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width="300"
                    height="350"
                  />
                </figure>
              );
            },
          )}
          <span className="handnote" aria-hidden="true">
            Bạn có ý tưởng?
            <br />
            Mình cùng bắt đầu!
          </span>
        </div>
      </section>
      <section className="section" aria-label="Các hình thức hợp tác">
        <div className="section-head" data-reveal>
          <div>
            <h2>
              Một kết nối.
              <br />
              Nhiều hướng đi.
            </h2>
          </div>
          <p>Chọn điều bạn đang quan tâm để tìm hiểu hướng hợp tác cùng TVS.</p>
        </div>
        <div
          className="partner-selector"
          role="tablist"
          aria-label="Hình thức hợp tác"
        >
          {partners.map((partner, index) => (
            <button
              key={partner.key}
              type="button"
              role="tab"
              ref={(node) => {
                refs.current[index] = node;
              }}
              id={`tab-${partner.key}`}
              aria-controls={`panel-${partner.key}`}
              aria-selected={index === selected}
              tabIndex={index === selected ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => selectFromKey(event, index)}
            >
              {partner.label}
            </button>
          ))}
        </div>
        {partners.map((partner, index) => (
          <div
            className="partner-panel"
            key={partner.key}
            id={`panel-${partner.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${partner.key}`}
            tabIndex={0}
            hidden={index !== selected}
          >
            <img
              src={partner.image}
              alt={partner.alt}
              width="600"
              height="540"
              loading="lazy"
            />
            <div>
              <h2>
                <HeadingLines lines={partner.titleLines} />
              </h2>
              <p>{partner.description}</p>
              <ul className="check-list">
                {partner.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink to={routes.inquiry("", partner.key)}>
                {partner.button}
              </ButtonLink>
            </div>
          </div>
        ))}
      </section>
      <section className="section">
        <div className="section-head" data-reveal>
          <h2>
            Bắt đầu từ
            <br />
            một cuộc trò chuyện.
          </h2>
        </div>
        <div className="steps-row">
          {[
            [
              "Kể TVS nghe.",
              "Chia sẻ khu vực, mô hình và nhu cầu kinh doanh của bạn.",
            ],
            [
              "Cùng tìm cách.",
              "Trao đổi danh mục, quy cách và phương án hợp tác phù hợp.",
            ],
            [
              "Cùng bắt đầu.",
              "Thống nhất các bước triển khai và đầu mối phối hợp.",
            ],
          ].map(([title, text], index) => (
            <article className="step" data-reveal key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="faq section" data-reveal>
        <h2>Có thể bạn đang muốn biết.</h2>
        <details>
          <summary>Tôi muốn nhận danh mục và báo giá sỉ?</summary>
          <p className="detail-content">
            Chọn “Nhà phân phối” trong trang liên hệ, thêm nhóm sản phẩm, khu
            vực và quy mô dự kiến để TVS có thông tin trao đổi cùng bạn.
          </p>
        </details>
        <details>
          <summary>Tôi chưa có cửa hàng, có thể trao đổi không?</summary>
          <p className="detail-content">
            Bạn có thể chia sẻ ý tưởng, khu vực và định hướng mô hình để bắt đầu
            trao đổi với TVS.
          </p>
        </details>
        <details>
          <summary>Tôi muốn tư vấn sản phẩm cho gia đình?</summary>
          <p className="detail-content">
            Khám phá trang Sản phẩm và chọn “Tư vấn món này”, hoặc gọi hotline
            1900 636 959.
          </p>
        </details>
      </section>
      <Callout label="Kết nối cùng TVS" to={routes.inquiry("", "distribution")}>
        Ý tưởng của bạn.
        <br />
        Cuộc trò chuyện của chúng ta.
      </Callout>
    </>
  );
};
export default PartnersPage;
