import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../data/products.json";
import { Badge, Callout, ProductGrid } from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
import { categories, routes } from "../utilities/routes.js";
import { catalogQuery, filterProducts, paginate } from "../utilities/core.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const ProductsPage = () => {
  // #region State and derived catalogue
  usePageMeta("Mỗi món ngon, một niềm vui");
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(12);
  const query = params.get("q") || "";
  const [searchText, setSearchText] = useState(query);
  useEffect(() => {
    setSearchText(query);
  }, [query]);
  const category = categories.some(([id]) => id === params.get("category"))
    ? params.get("category")
    : "all";
  const sort = ["az", "za"].includes(params.get("sort"))
    ? params.get("sort")
    : "default";
  const matched = useMemo(
    () => filterProducts(products, { query, category, sort }),
    [query, category, sort],
  );
  const page = paginate(matched, limit);
  const update = (change) => {
    setLimit(12);
    setParams(catalogQuery({ query, category, sort, ...change }), {
      replace: true,
      preventScrollReset: true,
    });
  };
  const clear = () => {
    setSearchText("");
    update({ query: "", category: "all", sort: "default" });
  };
  // #endregion
  return (
    <>
      <section className="page-intro">
        <div data-enter>
          <Badge heart>Một thực đơn, nhiều niềm vui</Badge>
          <h1>
            Mỗi món ngon,
            <br />
            <span className="display-accent">một niềm vui.</span>
          </h1>
          <p>
            Từ viên giòn dai, dimsum đến chả giò vàng ruộm.
            <br />
            Chọn món bạn thích, để Tân Việt Sin góp vị cho bữa ăn.
          </p>
        </div>
        <div className="handnote" aria-hidden="true" data-enter>
          Hôm nay,
          <br />
          nhà mình ăn gì? ↙
        </div>
      </section>
      <section aria-label="Danh mục sản phẩm">
        <div className="catalog-controls" data-enter>
          <div className="catalog-search-row">
            <form
              className="search-field"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Icon name="search" />
              <label className="sr-only" htmlFor="product-search">
                Tìm món ngon
              </label>
              <input
                id="product-search"
                type="search"
                placeholder="Bạn đang tìm món gì?"
                autoComplete="off"
                maxLength={120}
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  update({ query: event.target.value });
                }}
              />
              {query && (
                <button
                  className="search-clear"
                  type="button"
                  aria-label="Xóa từ khóa"
                  onClick={() => {
                    setSearchText("");
                    update({ query: "" });
                  }}
                >
                  <Icon name="close" />
                </button>
              )}
            </form>
            <label className="sort-field" htmlFor="product-sort">
              Sắp xếp
              <select
                id="product-sort"
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
              >
                <option value="default">Gợi ý từ TVS</option>
                <option value="az">Tên món: A → Z</option>
                <option value="za">Tên món: Z → A</option>
              </select>
            </label>
          </div>
          <div
            className="category-tabs"
            role="group"
            aria-label="Lọc nhóm sản phẩm"
          >
            {categories.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={category === id}
                onClick={() => update({ category: id })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="catalog-status">
          <span id="catalog-count" role="status" aria-live="polite">
            {page.total
              ? `Đang xem ${page.shown} / ${page.total} món ngon`
              : "Chưa tìm thấy món phù hợp"}
          </span>
          {(query || category !== "all" || sort !== "default") && (
            <button type="button" onClick={clear}>
              Xóa bộ lọc
            </button>
          )}
        </div>
        <ProductGrid products={page.visible} />
        {!page.total && (
          <div className="empty-state">
            <Icon name="search" />
            <h2>Chưa tìm thấy món bạn mê.</h2>
            <p>
              Thử một tên món khác hoặc xem lại tất cả sản phẩm của Tân Việt Sin
              nhé.
            </p>
            <button className="pill pill--green" type="button" onClick={clear}>
              Xem tất cả món ngon
            </button>
          </div>
        )}
        {page.remaining > 0 && (
          <div className="load-more">
            <button
              className="pill pill--outline"
              type="button"
              onClick={() => setLimit((value) => value + 12)}
            >
              Xem thêm {page.nextCount} món
            </button>
            <p>
              {page.shown} trong {page.total} món đang được hiển thị
            </p>
          </div>
        )}
      </section>
      <Callout label="Nhờ TVS tư vấn" to={routes.contact}>
        Bạn lên thực đơn.
        <br />
        TVS cùng bạn chọn món.
      </Callout>
    </>
  );
};
export default ProductsPage;
