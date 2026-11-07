import { useRef } from "react";
import { test, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCarousel from "../src/components/ProductCarousel.jsx";
import { usePageMotion } from "../src/hooks/usePageMotion.js";
import { useHeroEntrance } from "../src/hooks/useHeroEntrance.js";
import { setReducedMotion } from "./setup.js";

const carousel = () =>
  render(
    <MemoryRouter>
      <div className="home-page">
        <ProductCarousel />
      </div>
    </MemoryRouter>,
  );
const pointer = (node, type, x, extra = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, {
    pointerId: 1,
    clientX: x,
    isPrimary: true,
    button: 0,
    ...extra,
  });
  fireEvent(node, event);
};

test("dragging changes carousel geometry, captures the pointer and prevents accidental navigation", () => {
  const { container } = carousel();
  const region = screen.getByRole("region", { name: /10 món ngon/ });
  const before = container.querySelector(".product").style.transform;
  pointer(region, "pointerdown", 100);
  pointer(region, "pointermove", 170);
  expect(region).toHaveClass("is-dragging");
  expect(region.setPointerCapture).toHaveBeenCalledWith(1);
  expect(container.querySelector(".product").style.transform).not.toBe(before);
  pointer(region, "pointerup", 170);
  expect(region).not.toHaveClass("is-dragging");
  const click = new MouseEvent("click", { bubbles: true, cancelable: true });
  region.querySelector("a").dispatchEvent(click);
  expect(click.defaultPrevented).toBe(true);
});

test("a secondary pointer cannot move the carousel and cancel clears drag state", () => {
  const { container } = carousel();
  const region = screen.getByRole("region", { name: /10 món ngon/ });
  const before = container.querySelector(".product").style.transform;
  pointer(region, "pointerdown", 100, { isPrimary: false });
  pointer(region, "pointermove", 190);
  expect(container.querySelector(".product").style.transform).toBe(before);
  pointer(region, "pointerdown", 100);
  pointer(region, "pointermove", 190);
  pointer(region, "pointercancel", 190);
  expect(region).not.toHaveClass("is-dragging");
});

test("carousel suspends its animation frame while the document is hidden and resumes when visible", () => {
  setReducedMotion(false);
  carousel();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: true,
  });
  fireEvent(document, new Event("visibilitychange"));
  expect(cancelAnimationFrame).toHaveBeenCalled();
  const count = requestAnimationFrame.mock.calls.length;
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  fireEvent(document, new Event("visibilitychange"));
  expect(requestAnimationFrame.mock.calls.length).toBeGreaterThan(count);
});

const MotionFixture = ({ hero = false }) => {
  const ref = useRef(null);
  usePageMotion(ref, "/test", !hero);
  useHeroEntrance(hero ? ref : { current: null });
  return (
    <div ref={ref} data-testid="frame">
      <div className="topbar" data-enter>
        Navigation
      </div>
      <h1>
        <span>Headline</span>
      </h1>
      <div data-reveal data-testid="reveal">
        Below the fold
      </div>
    </div>
  );
};

test("entrance animation completes and all animation resources are cancelled on unmount", async () => {
  setReducedMotion(false);
  const view = render(<MotionFixture />);
  await act(async () => {});
  expect(screen.getByText("Navigation")).toHaveAttribute(
    "data-motion-state",
    "complete",
  );
  const animations = Element.prototype.animate.mock.results.map(
    (result) => result.value,
  );
  view.unmount();
  expect(animations.length).toBeGreaterThan(0);
  for (const animation of animations)
    expect(animation.cancel).toHaveBeenCalled();
});

test("below-fold elements reveal on intersection and the observer disconnects on unmount", async () => {
  setReducedMotion(false);
  let callback;
  const disconnect = vi.fn(),
    observe = vi.fn(),
    unobserve = vi.fn();
  globalThis.IntersectionObserver = class {
    constructor(handler) {
      callback = handler;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  };
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({ top: 2000 });
  const view = render(<MotionFixture />);
  const reveal = screen.getByTestId("reveal");
  expect(reveal).toHaveClass("reveal-wait");
  expect(observe).toHaveBeenCalledWith(reveal);
  await act(async () => {
    callback([{ isIntersecting: true, target: reveal }]);
  });
  expect(reveal).not.toHaveClass("reveal-wait");
  expect(reveal).toHaveAttribute("data-motion-state", "complete");
  expect(unobserve).toHaveBeenCalledWith(reveal);
  view.unmount();
  expect(disconnect).toHaveBeenCalled();
  rect.mockRestore();
});

test("hero entrance completes and reduced-motion users receive immediately readable content", async () => {
  setReducedMotion(false);
  const normal = render(<MotionFixture hero />);
  await act(async () => {});
  expect(screen.getByTestId("frame")).toHaveAttribute(
    "data-motion-state",
    "complete",
  );
  normal.unmount();
  setReducedMotion(true);
  Element.prototype.animate.mockClear();
  render(<MotionFixture hero />);
  expect(screen.getByTestId("frame")).toHaveAttribute(
    "data-motion-state",
    "reduced",
  );
  expect(Element.prototype.animate).not.toHaveBeenCalled();
});
