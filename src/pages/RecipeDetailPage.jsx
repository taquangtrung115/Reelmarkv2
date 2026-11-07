import { useParams } from "react-router-dom";
import recipes from "../data/recipes.json";
import products from "../data/products.json";
import {
  Badge,
  Breadcrumbs,
  ButtonLink,
  ProductGrid,
} from "../components/Shared.jsx";
import { routes } from "../utilities/routes.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import NotFoundPage from "./NotFoundPage.jsx";

const RecipeDetailPage = () => {
  const { slug } = useParams();
  const recipe = recipes.find((item) => item.slug === slug);
  usePageMeta(recipe?.title || "Không tìm thấy bài viết", recipe?.description);
  if (!recipe) return <NotFoundPage />;
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Món ngon", to: routes.recipes },
          { label: recipe.category },
        ]}
      />
      <article>
        <header className="article-head" data-enter>
          <Badge>{recipe.category}</Badge>
          <h1>{recipe.title}</h1>
          <p>{recipe.description}</p>
        </header>
        <img
          className="article-hero"
          src={recipe.hero}
          alt={recipe.title}
          width="960"
          height="560"
          fetchPriority="high"
          data-enter
        />
        <div className="article-body" data-reveal>
          {recipe.content.map((block, index) => {
            const Tag = block.tag;
            return (
              <Tag key={`${block.tag}-${index}`}>
                {block.items
                  ? block.items.map((item) => <li key={item}>{item}</li>)
                  : block.text}
              </Tag>
            );
          })}
          <aside className="article-note">
            <p>
              Gợi ý thực đơn để bạn tham khảo. Hãy ưu tiên hướng dẫn chế biến và
              bảo quản trên bao bì sản phẩm đang sử dụng.
            </p>
          </aside>
          <div className="article-actions">
            <ButtonLink
              to={`${routes.products}?category=${slug.includes("spring-roll") ? "spring-rolls" : "fish-balls"}`}
            >
              Chọn món cho bữa ăn này
            </ButtonLink>
            <ButtonLink to={routes.recipes} variant="outline">
              Thêm cảm hứng vào bếp
            </ButtonLink>
          </div>
        </div>
      </article>
      <section className="section">
        <div className="section-head" data-reveal>
          <h2>Món ngon cho câu chuyện này.</h2>
        </div>
        <ProductGrid
          products={recipe.products.map((id) =>
            products.find((product) => product.slug === id),
          )}
        />
      </section>
    </>
  );
};
export default RecipeDetailPage;
