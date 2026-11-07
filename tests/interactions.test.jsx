import { test, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import ProductCarousel from "../src/components/ProductCarousel.jsx";

const show = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

test("catalogue initially shows 12 products and loads the rest in two batches", async () => {
  show("/products");
  expect(screen.getAllByRole("article")).toHaveLength(12);
  await userEvent.click(
    screen.getByRole("button", { name: "Xem thêm 12 món" }),
  );
  expect(screen.getAllByRole("article")).toHaveLength(24);
  await userEvent.click(screen.getByRole("button", { name: "Xem thêm 7 món" }));
  expect(screen.getAllByRole("article")).toHaveLength(31);
  expect(
    screen.queryByRole("button", { name: /Xem thêm/ }),
  ).not.toBeInTheDocument();
});
test("search accepts Vietnamese without accents and empty results can be reset", async () => {
  show("/products");
  await userEvent.type(screen.getByRole("searchbox"), "bo vien");
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(
    screen.getByRole("heading", { name: "Bò viên Tân Việt Sin" }),
  ).toBeInTheDocument();
  await userEvent.clear(screen.getByRole("searchbox"));
  await userEvent.type(screen.getByRole("searchbox"), "not-a-real-dish");
  expect(
    screen.getByRole("heading", { name: "Chưa tìm thấy món bạn mê." }),
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "Xem tất cả món ngon" }),
  );
  expect(screen.getAllByRole("article")).toHaveLength(12);
});
test("category and sort state are read from English URL parameters", async () => {
  show("/products?category=dimsum&sort=za");
  expect(
    screen.getByRole("button", { name: "Dimsum", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getAllByRole("article")).toHaveLength(9);
  const names = screen
    .getAllByRole("article")
    .map((node) => within(node).getByRole("heading").textContent);
  expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a, "vi")));
  await userEvent.click(
    screen.getByRole("button", { name: "Chả giò", exact: true }),
  );
  expect(screen.getAllByRole("article")).toHaveLength(4);
});
test("product navigation is handled inside React and gallery state changes correctly", async () => {
  show("/products?category=fish-balls&q=bo+vien");
  await userEvent.click(
    screen.getByRole("link", { name: /Bò viên Tân Việt Sin Bò viên/ }),
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Bò viên Tân Việt Sin",
  );
  const before = screen
    .getByRole("button", { name: "Phóng to ảnh Bò viên Tân Việt Sin" })
    .querySelector("img").src;
  await userEvent.click(
    screen.getByRole("button", { name: "Xem ảnh sản phẩm" }),
  );
  expect(
    screen
      .getByRole("button", { name: "Phóng to ảnh Bò viên Tân Việt Sin" })
      .querySelector("img").src,
  ).not.toBe(before);
  await userEvent.click(
    screen.getByRole("button", { name: "Phóng to ảnh Bò viên Tân Việt Sin" }),
  );
  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  await userEvent.click(
    screen.getByRole("button", { name: "Đóng ảnh phóng to" }),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
test("mobile menu opens, closes with Escape, and navigates to another React page", async () => {
  show("/about");
  await userEvent.click(screen.getByRole("button", { name: "Mở menu" }));
  expect(screen.getByRole("button", { name: "Đóng menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await userEvent.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "Mở menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await userEvent.click(screen.getByRole("button", { name: "Mở menu" }));
  await userEvent.click(
    within(
      screen.getByRole("navigation", { name: "Điều hướng điện thoại" }),
    ).getByRole("link", { name: "Sản phẩm", exact: true }),
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Mỗi món ngon,",
  );
});
test("partnership tabs support mouse and keyboard and preserve contact purpose", async () => {
  show("/partners");
  await userEvent.click(screen.getByRole("tab", { name: "Vận hành chuỗi" }));
  expect(screen.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-chain-operations",
  );
  await userEvent.keyboard("{ArrowLeft}");
  expect(
    screen.getByRole("tab", { name: "Phát triển thị trường" }),
  ).toHaveAttribute("aria-selected", "true");
  await userEvent.click(
    screen.getByRole("link", { name: "Kết nối phát triển thị trường" }),
  );
  expect(screen.getByLabelText("Bạn quan tâm đến")).toHaveValue(
    "Phát triển thị trường",
  );
});
test("recipe actions go to the matching product category inside React", async () => {
  show("/recipes/spring-roll-family-story");
  await userEvent.click(
    screen.getByRole("link", { name: "Chọn món cho bữa ăn này" }),
  );
  expect(
    screen.getByRole("button", { name: "Chả giò", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("unknown product and recipe paths render a usable not-found page", () => {
  show("/products/missing");
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Trang này chưa có món.",
  );
  expect(screen.getByRole("link", { name: "Về trang chủ" })).toHaveAttribute(
    "href",
    "/",
  );
});
test("carousel reduced-motion default, toggle and keyboard controls work after conversion", async () => {
  const { container } = render(
    <MemoryRouter>
      <div className="home-page">
        <ProductCarousel />
      </div>
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("button", { name: "Tiếp tục chuyển động" }),
  ).toHaveAttribute("aria-pressed", "true");
  const region = screen.getByRole("region", { name: /10 món ngon/ });
  const before = container.querySelector(".product").style.transform;
  fireEvent.keyDown(region, { key: "ArrowRight" });
  expect(container.querySelector(".product").style.transform).not.toBe(before);
  await userEvent.click(
    screen.getByRole("button", { name: "Tiếp tục chuyển động" }),
  );
  expect(
    screen.getByRole("button", { name: "Tạm dừng chuyển động" }),
  ).toHaveAttribute("aria-pressed", "false");
});
test("React carousel cleans up its clock, listeners and requestAnimationFrame on unmount", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(
    <MemoryRouter>
      <div className="home-page">
        <ProductCarousel />
      </div>
    </MemoryRouter>,
  );
  const clock = Element.prototype.animate.mock.results[0].value;
  unmount();
  expect(clock.cancel).toHaveBeenCalled();
  expect(cancelAnimationFrame).toHaveBeenCalled();
  expect(remove).toHaveBeenCalledWith("resize", expect.any(Function), {
    passive: true,
  });
});
