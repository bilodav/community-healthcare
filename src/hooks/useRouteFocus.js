import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// On a real page change (a new pathname), move focus to the page's <h1> so
// keyboard and screen reader users start at the top of the new view.
// Query-string changes (filtering) are deliberately ignored.
export function useRouteFocus() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    // Skip first load, and React StrictMode's second effect run in dev
    if (previous.current === pathname) return;
    previous.current = pathname;

    const main = document.getElementById("main");
    const target = main?.querySelector("h1") ?? main;
    if (!target) return;

    // Headings aren't focusable by default. tabindex="-1" allows focus()
    // without adding the heading to the Tab order.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");

    window.scrollTo(0, 0);
    target.focus({ preventScroll: true });
  }, [pathname]);
}
