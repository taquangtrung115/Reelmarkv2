import { Link } from "react-router-dom";
import { navigation, routes } from "../utilities/routes.js";
import Icon from "./Icon.jsx";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-top">
      <div>
        <Link className="footer-wordmark" to={routes.home}>
          Tân Việt Sin Foods.
        </Link>
        <p>Món ngon tiện lợi. Bữa ăn trọn vẹn.</p>
      </div>
      <nav className="footer-navigation" aria-label="Liên kết cuối trang">
        {navigation.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
    <div className="footer-bottom">
      <span>
        © 2026 Tân Việt Sin Foods · Đồng hành cùng bữa ăn gia đình Việt
      </span>
      <a href="tel:1900636959">
        <Icon name="phone" />
        1900 636 959
      </a>
      <a href="mailto:info@tanvietsin.com">
        <Icon name="mail" />
        info@tanvietsin.com
      </a>
    </div>
  </footer>
);
export default Footer;
