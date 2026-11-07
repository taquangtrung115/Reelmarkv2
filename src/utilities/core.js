// #region Catalogue
function normalizeSearch(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function filterProducts(items, state = {}) {
  const query = normalizeSearch(state.query);
  const category = state.category || "all";
  const result = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      normalizeSearch(`${item.name} ${item.categoryName || ""}`).includes(
        query,
      ),
  );
  if (state.sort === "az" || state.sort === "za") {
    result.sort(
      (a, b) =>
        a.name.localeCompare(b.name, "vi") * (state.sort === "za" ? -1 : 1),
    );
  }
  return result;
}

function paginate(items, requestedLimit, pageSize = 12) {
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(0, Math.floor(requestedLimit))
    : pageSize;
  return {
    visible: items.slice(0, limit),
    total: items.length,
    shown: Math.min(limit, items.length),
    remaining: Math.max(0, items.length - limit),
    nextCount: Math.min(pageSize, Math.max(0, items.length - limit)),
  };
}

function catalogQuery(state) {
  const params = new URLSearchParams();
  if (state.category && state.category !== "all")
    params.set("category", state.category);
  if (String(state.query || "").trim())
    params.set("q", String(state.query).trim());
  if (["az", "za"].includes(state.sort)) params.set("sort", state.sort);
  return params.toString();
}
// #endregion

// #region Contact draft; preparing a draft never sends a message
const NEED_LABELS = Object.freeze({
  products: "Tư vấn sản phẩm & nơi mua",
  distribution: "Hợp tác phân phối thực phẩm",
  "market-development": "Phát triển thị trường",
  "chain-operations": "Vận hành chuỗi",
  other: "Nội dung khác",
});

function inquiryContext(params, productSlugs) {
  const need = params.get("purpose");
  const product = params.get("product");
  return {
    need: Object.hasOwn(NEED_LABELS, need) ? need : "products",
    product: productSlugs.includes(product) ? product : "",
  };
}

function buildInquiry(values) {
  const clean = (key) => String(values[key] || "").trim();
  const need = Object.hasOwn(NEED_LABELS, values.need) ? values.need : "other";
  const recipient = [
    "distribution",
    "market-development",
    "chain-operations",
  ].includes(need)
    ? "bod@tvsfastfood.com"
    : "info@tanvietsin.com";
  const subject = `TVS — ${NEED_LABELS[need]}`;
  const body = [
    "Xin chào TVS,",
    "",
    `Tôi là: ${clean("name")}`,
    `Email: ${clean("email")}`,
    ...(clean("phone") ? [`Điện thoại: ${clean("phone")}`] : []),
    ...(clean("company") ? [`Đơn vị / khu vực: ${clean("company")}`] : []),
    `Nhu cầu: ${NEED_LABELS[need]}`,
    `Sản phẩm quan tâm: ${clean("productName") || "Mong được tư vấn thêm"}`,
    "",
    clean("message") ||
      "Tôi mong được tư vấn thêm về sản phẩm và hình thức hợp tác phù hợp.",
    "",
    "Cảm ơn TVS.",
  ].join("\n");
  return {
    recipient,
    subject,
    body,
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
// #endregion

// #region Carousel geometry and physics
function roundedQuad(points, radius) {
  const corners = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const beforeLength = Math.hypot(
      previous[0] - point[0],
      previous[1] - point[1],
    );
    const afterLength = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const before = beforeLength
      ? Math.min(radius, beforeLength / 2) / beforeLength
      : 0;
    const after = afterLength
      ? Math.min(radius, afterLength / 2) / afterLength
      : 0;
    return {
      point,
      start: [
        point[0] + (previous[0] - point[0]) * before,
        point[1] + (previous[1] - point[1]) * before,
      ],
      end: [
        point[0] + (next[0] - point[0]) * after,
        point[1] + (next[1] - point[1]) * after,
      ],
    };
  });
  let path = `M ${corners[0].start.join(" ")}`;
  for (const corner of corners)
    path += ` L ${corner.start.join(" ")} Q ${corner.point.join(" ")} ${corner.end.join(" ")}`;
  return path + " Z";
}

function carouselGeometry(index, offset, options = {}) {
  const count = options.count || 10;
  const pitch = options.pitch || 196;
  const loopWidth = count * pitch;
  const mobile = Boolean(options.mobile);
  const centre = mobile ? 320 : 720;
  const curveRadius = mobile ? 430 : 706;
  const t =
    ((((index * pitch + offset + loopWidth / 2) % loopWidth) + loopWidth) %
      loopWidth) -
    loopWidth / 2;
  const x = centre + t * (1 + 0.083 * (t / curveRadius) ** 2);
  const distance = Math.abs(x - centre) / curveRadius;
  const width = 170 + 48 * distance ** 2;
  const leftHeight =
    280 + 92 * (Math.abs(x - width / 2 - centre) / curveRadius) ** 2.6;
  const rightHeight =
    280 + 92 * (Math.abs(x + width / 2 - centre) / curveRadius) ** 2.6;
  const height = Math.max(leftHeight, rightHeight);
  const cy = (mobile ? 180 : 206) - 12 * distance ** 2;
  const leftTop = (height - leftHeight) / 2;
  const rightTop = (height - rightHeight) / 2;
  const scale = mobile ? options.bandScale || 1 : 1;
  const points = [
    [0, leftTop],
    [width, rightTop],
    [width, height - rightTop],
    [0, height - leftTop],
  ];
  return {
    x,
    width,
    height,
    leftHeight,
    rightHeight,
    visible: x + width / 2 > -60 && x - width / 2 < centre * 2 + 60,
    transform: `translate3d(${(x - width / 2) * scale}px, ${(cy - height / 2) * scale}px, 0) scale(${scale})`,
    clipPath: `path('${roundedQuad(points, 15)}')`,
  };
}

function advanceCarousel(offset, velocity, elapsedSeconds, loopWidth) {
  const dt = Math.max(0, Math.min(elapsedSeconds, 0.05));
  return {
    offset: (offset + (-50 + velocity) * dt) % loopWidth,
    velocity: velocity * Math.pow(0.05, dt),
  };
}

function dragVelocity(delta, unitScale, elapsedMilliseconds) {
  const scale = Math.max(0.01, unitScale);
  return Math.max(
    -1800,
    Math.min(1800, delta / scale / (Math.max(8, elapsedMilliseconds) / 1000)),
  );
}
// #endregion

export {
  normalizeSearch,
  filterProducts,
  paginate,
  catalogQuery,
  inquiryContext,
  buildInquiry,
  roundedQuad,
  carouselGeometry,
  advanceCarousel,
  dragVelocity,
};
