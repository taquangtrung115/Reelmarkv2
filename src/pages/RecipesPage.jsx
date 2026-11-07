import { Link } from "react-router-dom";
import recipes from "../data/recipes.json";
import { Badge, Callout } from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
import { routes } from "../utilities/routes.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const RecipesPage = () => {
  usePageMeta("Vào bếp nhẹ tênh, ăn ngon mỗi ngày");
  return (
    <>
      <section className="magazine-hero">
        <div data-enter>
          <Badge heart>Cảm hứng cho gian bếp</Badge>
          <h1>
            Vào bếp nhẹ tênh.
            <br />
            <span className="display-accent">Ăn ngon mỗi ngày.</span>
          </h1>
          <p>
            Một công thức mới, một mẹo nhỏ hay chỉ là chút cảm hứng. Để hôm nay,
            vào bếp là một điều vui.
          </p>
          <div className="handnote" aria-hidden="true">
            Nấu chút ngon,
            <br />
            gửi chút thương. ↗
          </div>
        </div>
        <Link
          className="recipe-feature"
          to={routes.recipe(recipes[0].slug)}
          data-enter
        >
          <div className="recipe-image">
            <img
              src={recipes[0].hero}
              alt="Cá viên Tân Việt Sin cho món ngon mỗi ngày"
              width="650"
              height="550"
              fetchPriority="high"
            />
          </div>
          <div className="round-stamp" aria-hidden="true">
            Hôm nay
            <br />
            thử món này!
          </div>
        </Link>
      </section>
      <section className="section">
        <div className="section-head" data-reveal>
          <div>
            <h2>Góc bếp nhà mình.</h2>
            <p>Chọn một câu chuyện, tìm một món ngon.</p>
          </div>
        </div>
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <article className="recipe-card" data-reveal key={recipe.slug}>
              <Link
                to={routes.recipe(recipe.slug)}
                className="recipe-image"
                aria-label={`Đọc bài ${recipe.title}`}
              >
                <img
                  src={recipe.hero}
                  alt={recipe.title}
                  width="600"
                  height="430"
                  loading="lazy"
                />
              </Link>
              <div>
                <div className="recipe-meta">{recipe.category}</div>
                <h3>
                  <Link to={routes.recipe(recipe.slug)}>{recipe.title}</Link>
                </h3>
                <p>{recipe.description}</p>
                <Link className="text-link" to={routes.recipe(recipe.slug)}>
                  Đọc câu chuyện <Icon name="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Callout label="Chọn món ngon">
        Đã có cảm hứng?
        <br />
        Cùng chọn nguyên liệu nhé.
      </Callout>
    </>
  );
};
export default RecipesPage;
