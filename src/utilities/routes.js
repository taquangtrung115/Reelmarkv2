import products from "../data/products.json";
import recipes from "../data/recipes.json";

export const routes = Object.freeze({
  home: "/",
  about: "/about",
  products: "/products",
  recipes: "/recipes",
  partners: "/partners",
  contact: "/contact",
  product: (slug) => `/products/${encodeURIComponent(slug)}`,
  recipe: (slug) => `/recipes/${encodeURIComponent(slug)}`,
  inquiry: (product, purpose = "products") =>
    `/contact?${new URLSearchParams({ ...(product ? { product } : {}), purpose })}`,
});
export const navigation = [
  { path: routes.about, label: "Về TVS" },
  { path: routes.products, label: "Sản phẩm" },
  { path: routes.recipes, label: "Món ngon mỗi ngày" },
  { path: routes.partners, label: "Hợp tác" },
  { path: routes.contact, label: "Liên hệ" },
];
export const publicRoutes = [
  routes.home,
  ...navigation.map((item) => item.path),
  ...products.map((product) => routes.product(product.slug)),
  ...recipes.map((recipe) => routes.recipe(recipe.slug)),
];
export const categories = [
  ["all", "Tất cả món ngon"],
  ["fish-balls", "Viên & viên nhân"],
  ["dimsum", "Dimsum"],
  ["spring-rolls", "Chả giò"],
  ["fish-cakes", "Chả quết"],
  ["sausages", "Xúc xích"],
  ["others", "Món khác"],
];
export const purposes = [
  ["products", "Tư vấn sản phẩm & nơi mua"],
  ["distribution", "Hợp tác phân phối thực phẩm"],
  ["market-development", "Phát triển thị trường"],
  ["chain-operations", "Vận hành chuỗi"],
  ["other", "Nội dung khác"],
];
