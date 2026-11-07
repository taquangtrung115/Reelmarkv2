import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import App from "../src/App.jsx";
import { publicRoutes, routes } from "../src/utilities/routes.js";
import products from "../src/data/products.json";
import recipes from "../src/data/recipes.json";
import baseline from "./fixtures/static-catalogue-baseline.json";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const show = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
const allowed = /^\/(?:about|products|recipes|partners|contact)(?:\/|\?|$)/;

test("all 40 public routes and 31 product slugs are unique and English", () => {
  expect(publicRoutes).toHaveLength(40);
  expect(new Set(publicRoutes).size).toBe(40);
  expect(products).toHaveLength(31);
  for (const product of products)
    expect(product.slug).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
  for (const route of publicRoutes)
    expect(route === "/" || allowed.test(route)).toBe(true);
});

for (const route of [...publicRoutes, "/this-page-does-not-exist"]) {
  test(`React page renders local images and English links: ${route}`, () => {
    const { container } = show(route);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("navigation", { name: "Điều hướng chính" }),
    ).toBeInTheDocument();
    expect(container.querySelector("#main")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
    for (const image of container.querySelectorAll("img")) {
      expect(image.alt).not.toBe("");
      expect(image.getAttribute("src")).toMatch(/^\/assets\/images\//);
      expect(
        fs.existsSync(path.join(root, "public", image.getAttribute("src"))),
      ).toBe(true);
    }
    for (const anchor of container.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href");
      if (href.startsWith("/") && href !== "/") expect(href).toMatch(allowed);
      if (/^https?:/.test(href))
        expect(new URL(href).hostname).toBe("docs.google.com");
    }
    expect(document.title).not.toBe("");
  });
}

test("every product links to contact with its English product context", () => {
  show(routes.product("premium-fish-balls"));
  expect(screen.getByRole("link", { name: "Tư vấn món này" })).toHaveAttribute(
    "href",
    "/contact?product=premium-fish-balls&purpose=products",
  );
});

test("source assets and data preserve the original catalogue", () => {
  const previous = baseline;
  expect(products.map((product) => product.name)).toEqual(
    previous.map((product) => product.name),
  );
  expect(products.map((product) => product.sections)).toEqual(
    previous.map((product) => product.sections),
  );
  products.forEach((product, index) =>
    product.images.forEach((image, imageIndex) => {
      expect(
        createHash("sha256")
          .update(fs.readFileSync(path.join(root, "public", image)))
          .digest("hex"),
      ).toBe(previous[index].imageHashes[imageIndex]);
    }),
  );
});

test("all recipe references resolve to real products and English article routes", () => {
  expect(recipes).toHaveLength(3);
  for (const recipe of recipes) {
    expect(publicRoutes).toContain(routes.recipe(recipe.slug));
    for (const slug of recipe.products)
      expect(products.some((product) => product.slug === slug)).toBe(true);
  }
});

test("Vercel rewrites support loading and refreshing nested React routes", () => {
  const config = JSON.parse(
    fs.readFileSync(path.join(root, "vercel.json"), "utf8"),
  );
  expect(config.framework).toBe("vite");
  expect(config.outputDirectory).toBe("dist");
  expect(config.rewrites).toContainEqual({
    source: "/(.*)",
    destination: "/index.html",
  });
});
