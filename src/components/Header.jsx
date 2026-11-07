import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navigation, routes } from "../utilities/routes.js";
import Icon from "./Icon.jsx";

const Header = ({ home = false }) => {
  // #region State and lifecycle
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const headerRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  // #endregion
  return (
    <header className={`site-header${home ? " topbar" : ""}`} ref={headerRef}>
      <Link
        className="brand"
        to={routes.home}
        aria-label="Tân Việt Sin Foods — Trang chủ"
      >
        <img
          src="/assets/images/brand/tvs-logo.png"
          alt="Tân Việt Sin Foods"
          width="88"
          height="65"
        />
        <span className="brand-caption">
          THỰC PHẨM TIỆN LỢI
          <br />
          CHO BỮA ĂN NGON
        </span>
      </Link>
      <nav className="nav-links" aria-label="Điều hướng chính">
        {navigation.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="pill pill--light header-phone" href="tel:1900636959">
          Gọi tư vấn
        </a>
        <Link
          className="pill pill--green"
          to={routes.inquiry("", "distribution")}
        >
          Cùng hợp tác <Icon name="external" />
        </Link>
        <button
          ref={buttonRef}
          className="menu-toggle"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <nav
        className="mobile-menu"
        id="mobile-menu"
        aria-label="Điều hướng điện thoại"
        hidden={!open}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
          >
            {item.label}
            <Icon name="arrow" />
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
export default Header;
