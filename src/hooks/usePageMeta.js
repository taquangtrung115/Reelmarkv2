import { useEffect } from "react";
export const usePageMeta = (
  title,
  description = "Món ngon tiện lợi và cảm hứng vào bếp cùng Tân Việt Sin Foods.",
) => {
  useEffect(() => {
    document.title = `${title} — Tân Việt Sin Foods`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
};
