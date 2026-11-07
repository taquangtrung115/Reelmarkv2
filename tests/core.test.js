import { test } from "vitest";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import * as core from "../src/utilities/core.js";
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/products.json"), "utf8"),
);
const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} should be close to ${expected}`,
  );

// #region Catalogue
for (const [input, expected] of [
  ["  BÒ VIÊN Tân Việt Sin  ", "bo vien tan viet sin"],
  ["Đậu Hủ Hải Sản", "dau hu hai san"],
  ["đĐ", "dd"],
  ["Xíu Mại Tôm Thịt", "xiu mai tom thit"],
  ["a\u0301", "a"],
  ["", ""],
  [null, ""],
  [undefined, ""],
  [123, "123"],
]) {
  test(`normalizeSearch: ${JSON.stringify(input)}`, () =>
    assert.equal(core.normalizeSearch(input), expected));
}

test("empty catalogue query preserves order and does not mutate the source", () => {
  const original = products.map((product) => product.slug);
  assert.deepEqual(
    core.filterProducts(products).map((product) => product.slug),
    original,
  );
  assert.deepEqual(
    products.map((product) => product.slug),
    original,
  );
});
test("Vietnamese search accepts accented, uppercase and unaccented input", () => {
  for (const query of ["bo vien", "BÒ VIÊN", " bò viên "]) {
    assert.deepEqual(
      core.filterProducts(products, { query }).map((product) => product.slug),
      ["beef-balls"],
    );
  }
});
test("search includes the category label", () => {
  const result = core.filterProducts(products, { query: "dimsum" });
  assert.ok(result.length > 0);
  assert.ok(result.every((product) => product.category === "dimsum"));
});
for (const category of [
  "fish-balls",
  "dimsum",
  "spring-rolls",
  "fish-cakes",
  "sausages",
  "others",
]) {
  test(`category ${category} contains only matching products`, () => {
    const result = core.filterProducts(products, { category });
    assert.ok(result.length > 0);
    assert.ok(result.every((product) => product.category === category));
  });
}
test("search and category combine rather than override one another", () => {
  assert.equal(
    core.filterProducts(products, { category: "dimsum", query: "bo vien" })
      .length,
    0,
  );
  assert.ok(
    core.filterProducts(products, { category: "dimsum", query: "tom" }).length >
      0,
  );
});
test("unknown categories and missing terms have empty results", () => {
  assert.deepEqual(core.filterProducts(products, { category: "missing" }), []);
  assert.deepEqual(
    core.filterProducts(products, { query: "not-a-real-dish" }),
    [],
  );
  assert.deepEqual(core.filterProducts([], { query: "ca" }), []);
});
test("sorting follows Vietnamese collation in both directions without mutation", () => {
  const before = products.map((product) => product.slug);
  const ascending = core.filterProducts(products, { sort: "az" });
  const descending = core.filterProducts(products, { sort: "za" });
  for (let index = 1; index < ascending.length; index++)
    assert.ok(
      ascending[index - 1].name.localeCompare(ascending[index].name, "vi") <= 0,
    );
  assert.deepEqual(
    descending.map((product) => product.slug),
    ascending.map((product) => product.slug).reverse(),
  );
  assert.deepEqual(
    products.map((product) => product.slug),
    before,
  );
});
test("an unsupported sort retains the original order", () => {
  assert.deepEqual(
    core.filterProducts(products, { sort: "<script>" }),
    products,
  );
});
test("products without a category label remain searchable by name", () => {
  assert.equal(
    core.filterProducts([{ name: "Món thử", category: "test" }], {
      query: "mon",
    }).length,
    1,
  );
});

for (const [limit, shown, remaining, next] of [
  [0, 0, 31, 12],
  [12, 12, 19, 12],
  [24, 24, 7, 7],
  [36, 31, 0, 0],
  [-10, 0, 31, 12],
  [12.9, 12, 19, 12],
  [NaN, 12, 19, 12],
  [Infinity, 12, 19, 12],
]) {
  test(`pagination handles limit ${limit}`, () => {
    const page = core.paginate(products, limit);
    assert.equal(page.shown, shown);
    assert.equal(page.visible.length, shown);
    assert.equal(page.remaining, remaining);
    assert.equal(page.nextCount, next);
    assert.equal(page.total, 31);
    assert.deepEqual(page.visible, products.slice(0, shown));
  });
}
test("pagination handles no results and custom page sizes", () => {
  assert.deepEqual(core.paginate([], 12), {
    visible: [],
    total: 0,
    shown: 0,
    remaining: 0,
    nextCount: 0,
  });
  assert.equal(core.paginate(products, undefined, 5).shown, 5);
});
test("default catalogue state produces no query string", () =>
  assert.equal(
    core.catalogQuery({ category: "all", query: "  ", sort: "default" }),
    "",
  ));
test("catalogue URLs preserve Vietnamese and special characters safely", () => {
  const value = core.catalogQuery({
    category: "fish-balls",
    query: "  Bò viên & cá?  ",
    sort: "za",
  });
  const decoded = new URLSearchParams(value);
  assert.equal(decoded.get("q"), "Bò viên & cá?");
  assert.equal(decoded.get("category"), "fish-balls");
  assert.equal(decoded.get("sort"), "za");
});
test("catalogue URLs omit missing properties and unsupported sorting", () => {
  assert.equal(core.catalogQuery({}), "");
  assert.equal(core.catalogQuery({ sort: "bogus" }), "");
  assert.equal(
    new URLSearchParams(core.catalogQuery({ sort: "az" })).get("sort"),
    "az",
  );
});
// #endregion

// #region Contact drafts and URL context
for (const [need, recipient] of [
  ["products", "info@tanvietsin.com"],
  ["other", "info@tanvietsin.com"],
  ["distribution", "bod@tvsfastfood.com"],
  ["market-development", "bod@tvsfastfood.com"],
  ["chain-operations", "bod@tvsfastfood.com"],
  ["not-a-real-need", "info@tanvietsin.com"],
  ["__proto__", "info@tanvietsin.com"],
]) {
  test(`draft recipient for ${need}`, () =>
    assert.equal(core.buildInquiry({ need }).recipient, recipient));
}
test("draft context accepts a known product and need", () => {
  assert.deepEqual(
    core.inquiryContext(
      new URLSearchParams("product=beef-balls&purpose=distribution"),
      products.map((product) => product.slug),
    ),
    { product: "beef-balls", need: "distribution" },
  );
});
test("draft context ignores unknown, missing and prototype keys", () => {
  for (const query of [
    "",
    "product=unknown&purpose=unknown",
    "product=../index.html&purpose=__proto__",
  ]) {
    assert.deepEqual(
      core.inquiryContext(
        new URLSearchParams(query),
        products.map((product) => product.slug),
      ),
      { product: "", need: "products" },
    );
  }
});
test("a product-specific draft keeps the exact selected dish", () => {
  const draft = core.buildInquiry({
    name: " Nguyễn Ánh ",
    email: " demo@example.com ",
    phone: " 0900000000 ",
    company: " Cửa hàng mẫu ",
    need: "distribution",
    productName: " Bò viên Tân Việt Sin ",
    message: " Tư vấn quy cách. ",
  });
  assert.ok(draft.body.includes("Sản phẩm quan tâm: Bò viên Tân Việt Sin"));
  assert.ok(draft.body.includes("Tôi là: Nguyễn Ánh"));
  assert.ok(draft.body.includes("Điện thoại: 0900000000"));
  assert.ok(draft.body.includes("Đơn vị / khu vực: Cửa hàng mẫu"));
  assert.ok(draft.body.includes("Tư vấn quy cách."));
});
test("optional fields are omitted and empty messages have a useful default", () => {
  const draft = core.buildInquiry({
    need: "products",
    name: "A",
    email: "a@example.com",
  });
  assert.ok(!draft.body.includes("Điện thoại:"));
  assert.ok(!draft.body.includes("Đơn vị / khu vực:"));
  assert.ok(draft.body.includes("Mong được tư vấn thêm"));
  assert.ok(draft.body.includes("Tôi mong được tư vấn thêm"));
});
test("mailto encoding round-trips Unicode, newlines and special characters", () => {
  const draft = core.buildInquiry({
    need: "products",
    name: "A & B",
    message: "Cá & bò?\n#địa chỉ = 1+2 %",
  });
  const url = new URL(draft.href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "info@tanvietsin.com");
  assert.equal(url.searchParams.get("subject"), draft.subject);
  assert.equal(url.searchParams.get("body"), draft.body);
});
test("user content cannot inject email recipients or URL parameters", () => {
  const payload =
    "\r\n&bcc=attacker@example.com&subject=changed</textarea><script>alert(1)</script>";
  const draft = core.buildInquiry({
    need: payload,
    name: payload,
    message: payload,
  });
  const url = new URL(draft.href);
  assert.equal(url.pathname, "info@tanvietsin.com");
  assert.deepEqual(Array.from(url.searchParams.keys()), ["subject", "body"]);
  assert.ok(url.searchParams.get("body").includes(payload.trim()));
});
test("preparing a draft is pure and leaves the caller data unchanged", () => {
  const values = Object.freeze({ need: "products", productName: "Cá viên" });
  assert.deepEqual(core.buildInquiry(values), core.buildInquiry(values));
  assert.equal(values.productName, "Cá viên");
});
// #endregion

// #region Carousel geometry and motion
test("centre card is upright and has the requested width", () => {
  const geometry = core.carouselGeometry(0, 0);
  assert.equal(geometry.x, 720);
  assert.equal(geometry.width, 170);
  assert.equal(geometry.leftHeight, geometry.rightHeight);
  assert.equal(geometry.visible, true);
});
test("cards grow toward the edges and have taller outer edges", () => {
  const centre = core.carouselGeometry(0, 0);
  const right = core.carouselGeometry(3, 0);
  const left = core.carouselGeometry(7, 0);
  assert.ok(right.width > centre.width && right.height > centre.height);
  assert.ok(right.rightHeight > right.leftHeight);
  assert.ok(left.leftHeight > left.rightHeight);
  close(right.width, left.width);
});
test("positive and negative carousel loop offsets are periodic", () => {
  for (let index = 0; index < 10; index++) {
    const base = core.carouselGeometry(index, 37);
    for (const loops of [-100, -1, 1, 100]) {
      const geometry = core.carouselGeometry(index, 37 + loops * 1960);
      close(geometry.x, base.x);
      close(geometry.height, base.height);
    }
  }
});
test("offscreen cards are hidden without producing invalid geometry", () => {
  assert.equal(core.carouselGeometry(5, 0).visible, false);
  assert.equal(
    core.carouselGeometry(4, 0).visible,
    true,
    "partially visible edge cards stay in the pre-render buffer",
  );
  for (let index = 0; index < 10; index++) {
    for (const offset of [-1e6, -999, 0, 999, 1e6]) {
      const geometry = core.carouselGeometry(index, offset);
      assert.ok(Number.isFinite(geometry.width) && geometry.width > 0);
      assert.ok(Number.isFinite(geometry.height) && geometry.height > 0);
      assert.ok(!/NaN|Infinity/.test(geometry.clipPath + geometry.transform));
    }
  }
});
for (const width of [320, 375, 414, 768]) {
  test(`mobile geometry scales at ${width}px`, () => {
    const geometry = core.carouselGeometry(0, 0, {
      mobile: true,
      bandScale: width / 640,
    });
    assert.equal(geometry.x, 320);
    assert.ok(geometry.transform.endsWith(`scale(${width / 640})`));
    assert.equal(geometry.width, 170);
  });
}
test("custom counts and pitch have a matching loop period", () => {
  const a = core.carouselGeometry(2, 10, { count: 8, pitch: 200 });
  const b = core.carouselGeometry(2, 1610, { count: 8, pitch: 200 });
  close(a.x, b.x);
  assert.ok(
    core
      .carouselGeometry(0, 0, { mobile: true })
      .transform.endsWith("scale(1)"),
  );
});
test("rounded clipping closes the shape and caps oversized radii", () => {
  const square = [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ];
  for (const radius of [0, 15, 1000]) {
    const result = core.roundedQuad(square, radius);
    assert.ok(result.startsWith("M ") && result.endsWith(" Z"));
    assert.equal((result.match(/ Q /g) || []).length, 4);
    assert.ok(!/NaN|Infinity/.test(result));
  }
  assert.ok(
    !/NaN|Infinity/.test(
      core.roundedQuad(
        [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        15,
      ),
    ),
  );
});
test("auto-scroll moves left at 50 units per second across frame rates", () => {
  for (const step of [0.01, 0.02, 0.05]) {
    let offset = 0;
    for (let index = 0; index < Math.round(1 / step); index++)
      offset = core.advanceCarousel(offset, 0, step, 1960).offset;
    close(offset, -50);
  }
});
test("long background frames are capped and negative elapsed time is ignored", () => {
  assert.deepEqual(
    core.advanceCarousel(0, 0, 10, 1960),
    core.advanceCarousel(0, 0, 0.05, 1960),
  );
  assert.deepEqual(core.advanceCarousel(100, 200, -1, 1960), {
    offset: 100,
    velocity: 200,
  });
});
test("momentum decays and offset stays within the loop", () => {
  let state = { offset: 1959, velocity: 1000 };
  for (let index = 0; index < 20; index++)
    state = core.advanceCarousel(state.offset, state.velocity, 0.05, 1960);
  close(state.velocity, 50);
  assert.ok(Math.abs(state.offset) < 1960);
});
test("drag velocity accounts for scale and caps fling speed in both directions", () => {
  close(core.dragVelocity(10, 1, 100), 100);
  close(core.dragVelocity(10, 0.5, 100), 200);
  assert.equal(core.dragVelocity(10000, 1, 0), 1800);
  assert.equal(core.dragVelocity(-10000, 1, 0), -1800);
  assert.equal(core.dragVelocity(0, 0, 0), 0);
});
