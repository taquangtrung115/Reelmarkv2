import { useLayoutEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import PartnersPage from "./pages/PartnersPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { usePageMotion } from "./hooks/usePageMotion.js";
import { routes } from "./utilities/routes.js";

const App = () => {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const home = pathname === "/";
  usePageMotion(ref, pathname, !home);
  useLayoutEffect(() => {
    document.body.dataset.page = home ? "home" : "inner";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, home]);
  const pages = (
    <Routes key={pathname}>
      <Route path={routes.home} element={<HomePage />} />
      <Route path={routes.about} element={<AboutPage />} />
      <Route path={routes.products} element={<ProductsPage />} />
      <Route
        path={`${routes.products}/:slug`}
        element={<ProductDetailPage />}
      />
      <Route path={routes.recipes} element={<RecipesPage />} />
      <Route path={`${routes.recipes}/:slug`} element={<RecipeDetailPage />} />
      <Route path={routes.partners} element={<PartnersPage />} />
      <Route path={routes.contact} element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
  return (
    <div ref={ref}>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      {home ? (
        pages
      ) : (
        <>
          <Header />
          <main id="main" className="shell">
            {pages}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};
export default App;
