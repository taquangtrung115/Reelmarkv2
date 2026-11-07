import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products.json";
import {
  Badge,
  Breadcrumbs,
  ButtonLink,
  ProductGrid,
} from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
import { routes } from "../utilities/routes.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import NotFoundPage from "./NotFoundPage.jsx";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [imageIndex, setImageIndex] = useState(0);
  const dialogRef = useRef(null);
  usePageMeta(product?.name || "Không tìm thấy sản phẩm", product?.description);
  if (!product) return <NotFoundPage />;
  const ingredient =
    product.sections.find((section) =>
      section.title.toLowerCase().startsWith("thành phần"),
    )?.text || "Vui lòng tham khảo thông tin thành phần trên bao bì sản phẩm.";
  const usage =
    product.sections.find((section) =>
      section.title.toLowerCase().includes("sử dụng và chế biến"),
    )?.text || "Chế biến theo hướng dẫn ghi trên bao bì sản phẩm.";
  const related = products
    .filter((item) => item.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === product.category) -
        Number(a.category === product.category),
    )
    .slice(0, 4);
  const activeImage = product.images[imageIndex] || product.images[0];
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Sản phẩm", to: routes.products },
          { label: product.name },
        ]}
      />
      <section className="product-detail">
        <div className="product-gallery" data-enter>
          <button
            className="gallery-main"
            type="button"
            aria-label={`Phóng to ảnh ${product.name}`}
            onClick={() => dialogRef.current.showModal()}
          >
            <img
              src={activeImage}
              alt={product.name}
              width="600"
              height="600"
              fetchPriority="high"
            />
            <span className="zoom-icon">
              <Icon name="zoom" />
            </span>
          </button>
          <div
            className="gallery-thumbs"
            role="group"
            aria-label="Ảnh sản phẩm"
          >
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-pressed={imageIndex === index}
                aria-label={index === 0 ? "Xem ảnh món ăn" : "Xem ảnh sản phẩm"}
                onClick={() => setImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} — ${index === 0 ? "món ăn" : "hình sản phẩm"}`}
                  width="80"
                  height="80"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="product-copy" data-enter>
          <Badge>{product.categoryName}</Badge>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <dl className="product-facts">
            <div>
              <dt>Quy cách</dt>
              <dd>
                {product.weight
                  ? `${product.weight} g`
                  : "Theo bao bì sản phẩm"}
              </dd>
            </div>
            <div>
              <dt>Mã sản phẩm</dt>
              <dd>{product.sku || "Liên hệ tư vấn"}</dd>
            </div>
          </dl>
          <div className="pill-ring">
            <ButtonLink to={routes.inquiry(product.slug)}>
              Tư vấn món này
            </ButtonLink>
          </div>
          <p className="product-fineprint">
            Liên hệ TVS để được tư vấn quy cách, giá và nơi mua phù hợp.
          </p>
          <div className="handnote" aria-hidden="true">
            Món này,
            <br />
            phải thử mới biết! ↖
          </div>
        </div>
      </section>
      <section
        className="detail-tabs"
        aria-label="Thông tin sản phẩm"
        data-reveal
      >
        <details open>
          <summary>Thành phần</summary>
          <p className="detail-content">{ingredient}</p>
        </details>
        <details>
          <summary>Gợi ý chế biến</summary>
          <p className="detail-content">{usage}</p>
        </details>
        <details>
          <summary>Bảo quản &amp; lưu ý</summary>
          <p className="detail-content">
            Kiểm tra nhiệt độ bảo quản, ngày sản xuất, hạn dùng và hướng dẫn sử
            dụng trên bao bì. Thành phần và quy cách có thể thay đổi theo phiên
            bản sản phẩm; ưu tiên thông tin trên nhãn của sản phẩm bạn đang sử
            dụng. Không dùng khi mẫn cảm với thành phần sản phẩm.
          </p>
        </details>
      </section>
      <section className="section">
        <div className="section-head" data-reveal>
          <div>
            <h2>Thêm món, thêm vui.</h2>
            <p>Biết đâu, món yêu thích tiếp theo đang ở đây.</p>
          </div>
          <Link className="text-link" to={routes.products}>
            Tất cả món ngon <Icon name="arrow" />
          </Link>
        </div>
        <ProductGrid products={related} />
      </section>
      <dialog
        ref={dialogRef}
        className="photo-dialog"
        aria-label={`Ảnh phóng to ${product.name}`}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <button
          className="dialog-close"
          type="button"
          aria-label="Đóng ảnh phóng to"
          onClick={() => dialogRef.current.close()}
        >
          <Icon name="close" />
        </button>
        <img src={activeImage} alt={product.name} width="800" height="800" />
      </dialog>
    </>
  );
};
export default ProductDetailPage;
