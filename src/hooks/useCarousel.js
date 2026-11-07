import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  advanceCarousel,
  carouselGeometry,
  dragVelocity,
} from "../utilities/core.js";
import { useMediaQuery } from "./useMediaQuery.js";

export const useCarousel = (ref, count) => {
  // #region State and lifecycle
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [paused, setPaused] = useState(reduced);
  const pausedRef = useRef(paused);
  const state = useRef({
    offset: 0,
    velocity: 0,
    pointer: null,
    distance: 0,
    focused: false,
    lastX: 0,
    lastPointerTime: 0,
    suppressUntil: 0,
  });
  const layoutRef = useRef(() => {});
  useEffect(() => {
    pausedRef.current = reduced;
    setPaused(reduced);
  }, [reduced]);
  const togglePaused = () =>
    setPaused((current) => {
      pausedRef.current = !current;
      return !current;
    });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const cards = Array.from(node.querySelectorAll(".product"));
    const container = node.closest(".home-page");
    const clock = document.documentElement.animate(
      [{ opacity: 1 }, { opacity: 1 }],
      { duration: 1e9 },
    );
    let mobile = false,
      scale = 1,
      bandScale = 1,
      lastTime = clock.currentTime || 0,
      frameId = null;
    const physics = state.current;
    const layout = () =>
      cards.forEach((card, index) => {
        const geometry = carouselGeometry(index, physics.offset, {
          count,
          mobile,
          bandScale,
        });
        card.style.visibility = geometry.visible ? "visible" : "hidden";
        if (!geometry.visible) return;
        Object.assign(card.style, {
          width: `${geometry.width}px`,
          height: `${geometry.height}px`,
          clipPath: geometry.clipPath,
          transformOrigin: "0 0",
          transform: geometry.transform,
        });
      });
    layoutRef.current = (amount) => {
      physics.offset += amount;
      physics.velocity = 0;
      layout();
    };
    const resize = () => {
      mobile = window.innerWidth <= 820;
      scale = Math.min(window.innerWidth / 1440, window.innerHeight / 1080);
      bandScale = mobile ? node.clientWidth / 640 : 1;
      container.style.setProperty("--scale", String(scale));
      container.style.setProperty("--band-scale", String(bandScale));
      const height = Math.max(206, 360 * bandScale);
      node.style.height = mobile ? `${height}px` : "";
      node.parentElement.style.height = mobile ? `${height + 36}px` : "";
      layout();
    };
    const tick = () => {
      const now = clock.currentTime || 0;
      if (physics.pointer === null && !physics.focused && !pausedRef.current) {
        Object.assign(
          physics,
          advanceCarousel(
            physics.offset,
            physics.velocity,
            (now - lastTime) / 1000,
            count * 196,
          ),
        );
        layout();
      }
      lastTime = now;
      frameId = requestAnimationFrame(tick);
    };
    const listeners = [];
    const listen = (target, type, callback, options) => {
      target.addEventListener(type, callback, options);
      listeners.push(() => target.removeEventListener(type, callback, options));
    };
    const finish = (event) => {
      if (physics.pointer !== event.pointerId) return;
      if (physics.distance > 6) physics.suppressUntil = performance.now() + 350;
      if (node.hasPointerCapture?.(physics.pointer))
        node.releasePointerCapture(physics.pointer);
      physics.pointer = null;
      node.classList.remove("is-dragging");
      if (
        event.type === "pointercancel" ||
        event.timeStamp - physics.lastPointerTime > 120
      )
        physics.velocity = 0;
    };
    listen(node, "pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      Object.assign(physics, {
        pointer: event.pointerId,
        lastX: event.clientX,
        lastPointerTime: event.timeStamp,
        distance: 0,
        velocity: 0,
      });
    });
    listen(node, "pointermove", (event) => {
      if (event.pointerId !== physics.pointer) return;
      const dx = event.clientX - physics.lastX;
      physics.distance += Math.abs(dx);
      if (physics.distance > 6) {
        if (!node.hasPointerCapture?.(event.pointerId))
          node.setPointerCapture?.(event.pointerId);
        node.classList.add("is-dragging");
      }
      const unitScale = mobile ? bandScale : scale;
      physics.offset += dx / unitScale;
      physics.velocity = dragVelocity(
        dx,
        unitScale,
        event.timeStamp - physics.lastPointerTime,
      );
      physics.lastX = event.clientX;
      physics.lastPointerTime = event.timeStamp;
      layout();
    });
    listen(node, "pointerup", finish);
    listen(node, "pointercancel", finish);
    listen(window, "pointerup", finish);
    listen(node, "lostpointercapture", () => {
      physics.pointer = null;
      node.classList.remove("is-dragging");
    });
    listen(
      node,
      "click",
      (event) => {
        if (performance.now() < physics.suppressUntil) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true,
    );
    listen(node, "dragstart", (event) => event.preventDefault());
    listen(node, "focusin", (event) => {
      physics.focused = event.target.matches(":focus-visible");
    });
    listen(node, "focusout", (event) => {
      physics.focused = node.contains(event.relatedTarget);
    });
    listen(node, "keydown", (event) => {
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        layoutRef.current(event.key === "ArrowRight" ? -196 : 196);
      }
    });
    listen(window, "resize", resize, { passive: true });
    listen(document, "visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = null;
      } else if (frameId === null) {
        lastTime = clock.currentTime || 0;
        tick();
      }
    });
    resize();
    tick();
    return () => {
      listeners.forEach((remove) => remove());
      cancelAnimationFrame(frameId);
      clock.cancel();
      layoutRef.current = () => {};
      physics.pointer = null;
    };
  }, [ref, count]);
  // #endregion
  return { paused, togglePaused };
};
