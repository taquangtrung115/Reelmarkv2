import { useSearchParams } from "react-router-dom";
import products from "../data/products.json";
import ContactForm from "../components/ContactForm.jsx";
import { Badge } from "../components/Shared.jsx";
import Icon from "../components/Icon.jsx";
import { inquiryContext } from "../utilities/core.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const ContactPage = () => {
  usePageMeta("Một lời chào, nhiều kết nối");
  const [params] = useSearchParams();
  const context = inquiryContext(
    params,
    products.map((product) => product.slug),
  );
  return (
    <section className="contact-layout">
      <div className="contact-info" data-enter>
        <Badge heart>Chúng tôi đang lắng nghe</Badge>
        <h1>
          Một lời chào.
          <br />
          <span className="display-accent">Nhiều kết nối.</span>
        </h1>
        <p>
          Bạn muốn hỏi về một món ngon, tìm nơi mua hay trao đổi cơ hội hợp tác?
          Kể TVS nghe nhé.
        </p>
        <div className="handnote" aria-hidden="true">
          Chuyện gì cũng bắt đầu
          <br />
          từ một lời chào.
        </div>
        <div className="contact-lines">
          <div className="contact-line">
            <Icon name="phone" />
            <div>
              <small>Tư vấn sản phẩm Tân Việt Sin</small>
              <a href="tel:1900636959">1900 636 959</a>
            </div>
          </div>
          <div className="contact-line">
            <Icon name="mail" />
            <div>
              <small>Chăm sóc khách hàng</small>
              <a href="mailto:info@tanvietsin.com">info@tanvietsin.com</a>
            </div>
          </div>
          <div className="contact-line">
            <Icon name="phone" />
            <div>
              <small>Hợp tác cùng TVS Fast Food</small>
              <a href="tel:0903090090">0903 090 090</a>
              <br />
              <a className="secondary-email" href="mailto:bod@tvsfastfood.com">
                bod@tvsfastfood.com
              </a>
            </div>
          </div>
          <div className="contact-line">
            <Icon name="pin" />
            <div>
              <small>Trụ sở Tân Việt Sin Foods</small>
              <p>
                Số 01–13, Khu thương mại, dịch vụ và văn phòng, Chung cư Phương
                Việt (The Pegasuite), 1002 Tạ Quang Bửu, phường Bình Đông, Thành
                phố Hồ Chí Minh.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div data-enter>
        <ContactForm context={context} />
        <p className="form-note contact-faq">
          Bạn cần trao đổi trực tiếp? Gọi hotline ở bên cạnh để kết nối với đúng
          bộ phận.
        </p>
      </div>
    </section>
  );
};
export default ContactPage;
