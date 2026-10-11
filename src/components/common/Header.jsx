import Navbar from "../navigation/Navbar";
import styles from "./Header.module.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // sets the correct state when page loads **Fixes mid-pagerefresh error
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open: Escape closes it and returns focus to the button
  // that opened it; moving focus or clicking outside the header also closes
  // it. No focus trap: this is a disclosure menu, not a modal, so the page
  // behind it stays reachable.
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onOutside = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onOutside);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onOutside);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={scrolled ? styles["scrolled"] : undefined}
    >
      <Link
        className={styles["site-name"]}
        to="/"
        onClick={() => setMenuOpen(false)}
      >
        Muni
        <svg
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M192 32l0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 64 0c53 0 96 43 96 96s-43 96-96 96l-16 0 0-64 16 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0 192 32 0c53 0 96 43 96 96 0 47.6-34.6 87.1-80 94.7l0-67c9.6-5.5 16-15.9 16-27.7 0-17.7-14.3-32-32-32l-32 0 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32-32 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-64-32 0c-53 0-96-43-96-96 0-47.6 34.6-87.1 80-94.7l0 67c-9.6 5.5-16 15.9-16 27.7 0 17.7 14.3 32 32 32l32 0 0-192-72.6 0c-11.1 19.1-31.7 32-55.4 32l-16 0C21.5 128 0 106.5 0 80S21.5 32 48 32l144 0z" />
        </svg>
        Clinic
      </Link>

      <button
        ref={burgerRef}
        type="button"
        className={styles["burger"]}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <Navbar
        id="main-nav"
        isOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
    </header>
  );
}

export default Header;
