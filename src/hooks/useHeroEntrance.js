import { useLayoutEffect } from "react";
import { useMediaQuery } from "./useMediaQuery.js";

export const useHeroEntrance = (ref) => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useLayoutEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    frame.dataset.motionState = reduced ? "reduced" : "running";
    if (reduced) return;
    let active = true;
    const animations = [];
    const reveal = (selector, delay, from, duration = 650) =>
      frame
        .querySelectorAll(selector)
        .forEach((element, index) =>
          animations.push(
            element.animate(
              [
                from,
                {
                  opacity: 1,
                  transform: "translateY(0) scale(1)",
                  filter: "blur(0)",
                },
              ],
              {
                duration,
                delay: delay + index * 90,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "backwards",
              },
            ),
          ),
        );
    reveal(".topbar", 0, { opacity: 0, transform: "translateY(-12px)" });
    reveal(".badge", 90, { opacity: 0, transform: "scale(.94)" });
    reveal("h1 span", 170, {
      opacity: 0,
      transform: "translateY(18px)",
      filter: "blur(7px)",
    });
    reveal(".subline", 390, { opacity: 0, transform: "translateY(10px)" });
    reveal(
      ".carousel-wrap",
      480,
      { opacity: 0, transform: "translateY(28px)" },
      900,
    );
    reveal(".hero-action", 620, { opacity: 0, transform: "scale(.96)" });
    frame
      .querySelectorAll(".note")
      .forEach((element) =>
        animations.push(
          element.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 500,
            delay: 850,
            fill: "backwards",
          }),
        ),
      );
    frame.querySelectorAll(".doodle path").forEach((path) => {
      const length = path.getTotalLength();
      animations.push(
        path.animate(
          [
            { strokeDasharray: `${length}`, strokeDashoffset: length },
            { strokeDasharray: `${length}`, strokeDashoffset: 0 },
          ],
          {
            duration: 900,
            delay: 750,
            easing: "cubic-bezier(.45,0,.55,1)",
            fill: "backwards",
          },
        ),
      );
    });
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (active) frame.dataset.motionState = "complete";
      })
      .catch(() => {});
    return () => {
      active = false;
      animations.forEach((animation) => animation.cancel());
    };
  }, [ref, reduced]);
};
