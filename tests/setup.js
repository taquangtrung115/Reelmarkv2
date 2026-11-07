import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

let reduceMotion = true;
export const setReducedMotion = (value) => {
  reduceMotion = value;
};
beforeEach(() => {
  reduceMotion = true;
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes("prefers-reduced-motion") ? reduceMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  window.scrollTo = vi.fn();
  globalThis.requestAnimationFrame = vi.fn(() => 1);
  globalThis.cancelAnimationFrame = vi.fn();
  Element.prototype.animate = vi.fn(() => ({
    currentTime: 0,
    finished: Promise.resolve(),
    cancel: vi.fn(),
    finish: vi.fn(),
  }));
  SVGElement.prototype.getTotalLength = vi.fn(() => 100);
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  document.body.className = "";
  delete document.body.dataset.page;
});
