import { useLayoutEffect } from "react";
import { useMediaQuery } from "./useMediaQuery.js";

export const usePageMotion = (ref, route, enabled = true) => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    let active = true;
    const animations = [];
    const reveal = (element, delay = 0) => {
      element.classList.remove("reveal-wait");
      element.dataset.motionState = reduced ? "reduced" : "running";
      if (reduced || !element.animate) return;
      const animation = element.animate(
        [
          { opacity: 0, transform: "translateY(22px)", filter: "blur(3px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
        ],
        {
          duration: 650,
          delay,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        },
      );
      animations.push(animation);
      animation.finished
        .then(() => {
          if (active) element.dataset.motionState = "complete";
        })
        .catch(() => {});
    };
    node
      .querySelectorAll("[data-enter]")
      .forEach((element, index) => reveal(element, Math.min(index * 75, 300)));
    const observer =
      !reduced && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  reveal(entry.target);
                  observer.unobserve(entry.target);
                }
              }),
            { threshold: 0.08 },
          )
        : null;
    node.querySelectorAll("[data-reveal]").forEach((element) => {
      if (observer && element.getBoundingClientRect().top >= innerHeight - 30) {
        element.classList.add("reveal-wait");
        observer.observe(element);
      } else element.classList.remove("reveal-wait");
    });
    return () => {
      active = false;
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      node
        .querySelectorAll(".reveal-wait")
        .forEach((element) => element.classList.remove("reveal-wait"));
    };
  }, [ref, route, enabled, reduced]);
};
