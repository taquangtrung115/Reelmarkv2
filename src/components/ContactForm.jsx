import { useEffect, useId, useRef, useState } from "react";
import products from "../data/products.json";
import { purposes } from "../utilities/routes.js";
import { buildInquiry } from "../utilities/core.js";
import { contactService } from "../services/contact-service.js";
import Icon from "./Icon.jsx";

const ContactForm = ({ context, formUrl }) => {
  // #region Form state and lifecycle
  const config = contactService.getGoogleFormConfig(formUrl);
  const target = `tvs-form-${useId().replaceAll(":", "")}`;
  const [values, setValues] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    need: context.need,
    product: context.product,
  }));
  const [invalid, setInvalid] = useState([]);
  const [draft, setDraft] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [status, setStatus] = useState("");
  const pending = useRef(false);
  useEffect(() => {
    setValues((current) => ({
      ...current,
      need: context.need,
      product: context.product,
    }));
  }, [context.need, context.product]);
  useEffect(() => {
    if (phase !== "sending") return;
    const timer = setTimeout(() => {
      pending.current = false;
      setPhase("timeout");
      setStatus(
        "Chưa nhận được kết quả từ Google. Bạn có thể kiểm tra biểu mẫu bên dưới hoặc mở trong tab riêng.",
      );
    }, 20000);
    return () => clearTimeout(timer);
  }, [phase]);
  const change = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setInvalid((current) => current.filter((item) => item !== field));
    setDraft(null);
    setStatus("");
  };
  const fieldName = (field) => (config ? config.fields[field] : field);
  const submit = (event) => {
    if (!event.currentTarget.reportValidity() || pending.current) {
      event.preventDefault();
      return;
    }
    setInvalid([]);
    if (config) {
      // A native form POST avoids CORS workarounds. The actual Google response stays visible.
      pending.current = true;
      setPhase("sending");
      setStatus("Đang gửi yêu cầu tới Google Forms…");
      return;
    }
    event.preventDefault();
    setDraft(
      buildInquiry({
        ...values,
        productName:
          products.find((product) => product.slug === values.product)?.name ||
          "",
      }),
    );
    setStatus("Nội dung đã sẵn sàng để bạn kiểm tra. Email chưa được gửi.");
  };
  const responseLoaded = () => {
    if (!pending.current) return;
    pending.current = false;
    setPhase("response");
    setStatus(
      "Phản hồi từ Google đã tải. Vui lòng xem xác nhận trong khung kết quả bên dưới.",
    );
  };
  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft.body);
      setStatus("Đã sao chép nội dung yêu cầu.");
    } catch {
      setStatus("Bạn có thể chọn và sao chép nội dung bản nháp bên dưới.");
    }
  };
  // #endregion
  return (
    <div>
      <form
        className="contact-form"
        id="contact-form"
        action={config?.responseUrl}
        method={config ? "POST" : undefined}
        target={config ? target : undefined}
        onSubmit={submit}
        onInvalid={(event) => {
          const field = event.target.id.replace("contact-", "");
          setInvalid((current) => [...new Set([...current, field])]);
        }}
      >
        <h2>TVS có thể giúp gì cho bạn?</h2>
        <p>
          {config
            ? "Chia sẻ nhu cầu của bạn để TVS có thông tin tư vấn và kết nối."
            : "Để lại nội dung bên dưới để chuẩn bị email gửi đúng bộ phận tư vấn."}
        </p>
        {config && (
          <>
            <input type="hidden" name="fvv" value="1" />
            <input type="hidden" name="pageHistory" value="0" />
          </>
        )}
        <div className="field">
          <label htmlFor="contact-need">Bạn quan tâm đến</label>
          <select
            id="contact-need"
            name={fieldName("need")}
            value={
              config
                ? purposes.find(([key]) => key === values.need)?.[1]
                : values.need
            }
            onChange={(event) =>
              change(
                "need",
                config
                  ? purposes.find(
                      ([, label]) => label === event.target.value,
                    )?.[0] || "other"
                  : event.target.value,
              )
            }
          >
            {purposes.map(([key, label]) => (
              <option key={key} value={config ? label : key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="contact-name">Họ và tên *</label>
            <input
              id="contact-name"
              name={fieldName("name")}
              value={values.name}
              onChange={(event) => change("name", event.target.value)}
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Tên của bạn"
              aria-invalid={invalid.includes("name") || undefined}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-phone">
              Số điện thoại <span>(không bắt buộc)</span>
            </label>
            <input
              id="contact-phone"
              name={fieldName("phone")}
              value={values.phone}
              onChange={(event) => change("phone", event.target.value)}
              type="tel"
              autoComplete="tel"
              pattern="[+0-9\(\) .\-]{8,20}"
              maxLength={20}
              placeholder="Số điện thoại liên hệ"
              aria-invalid={invalid.includes("phone") || undefined}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email *</label>
          <input
            id="contact-email"
            name={fieldName("email")}
            value={values.email}
            onChange={(event) => change("email", event.target.value)}
            type="email"
            required
            maxLength={150}
            autoComplete="email"
            placeholder="Email của bạn"
            aria-invalid={invalid.includes("email") || undefined}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-company">
            Đơn vị / khu vực <span>(không bắt buộc)</span>
          </label>
          <input
            id="contact-company"
            name={fieldName("company")}
            value={values.company}
            onChange={(event) => change("company", event.target.value)}
            maxLength={150}
            autoComplete="organization"
            placeholder="Ví dụ: Cửa hàng của bạn, TP. Hồ Chí Minh"
          />
        </div>
        <div className="field">
          <label htmlFor="contact-product">Món ngon bạn quan tâm</label>
          <select
            id="contact-product"
            name={fieldName("product")}
            value={
              config
                ? products.find((product) => product.slug === values.product)
                    ?.name || "Mong TVS gợi ý thêm"
                : values.product
            }
            onChange={(event) =>
              change(
                "product",
                config
                  ? products.find(
                      (product) => product.name === event.target.value,
                    )?.slug || ""
                  : event.target.value,
              )
            }
          >
            <option value={config ? "Mong TVS gợi ý thêm" : ""}>
              Mong TVS gợi ý thêm
            </option>
            {products.map((product) => (
              <option
                key={product.slug}
                value={config ? product.name : product.slug}
              >
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="contact-message">Lời nhắn của bạn</label>
          <textarea
            id="contact-message"
            name={fieldName("message")}
            value={values.message}
            onChange={(event) => change("message", event.target.value)}
            maxLength={1500}
            placeholder="Chia sẻ nhu cầu, số lượng dự kiến hoặc điều bạn muốn hỏi..."
          />
        </div>
        {invalid.length > 0 && (
          <p className="form-error" role="alert">
            Vui lòng kiểm tra họ tên, email và số điện thoại (nếu có).
          </p>
        )}
        <button
          className="pill pill--green"
          type="submit"
          disabled={phase === "sending"}
        >
          {config
            ? phase === "sending"
              ? "Đang gửi…"
              : "Gửi yêu cầu tư vấn"
            : "Soạn email tư vấn"}
          <Icon name="arrow" />
        </button>
        <p className="form-note">
          {config
            ? "Thông tin được gửi qua Google Forms để TVS tiếp nhận và tư vấn. Kết quả gửi sẽ hiển thị ngay bên dưới."
            : "Bạn sẽ xem lại nội dung trước khi mở ứng dụng email. Thông tin chỉ được gửi khi bạn xác nhận gửi trong ứng dụng email của mình."}
        </p>
        {draft && (
          <section className="contact-review">
            <h3>Email của bạn đã sẵn sàng.</h3>
            <p>
              Gửi đến <strong>{draft.recipient}</strong>
            </p>
            <label className="sr-only" htmlFor="email-preview">
              Nội dung email để kiểm tra
            </label>
            <textarea id="email-preview" readOnly value={draft.body} />
            <div className="form-actions">
              <a className="pill pill--green" href={draft.href}>
                Mở ứng dụng email <Icon name="external" />
              </a>
              <button
                className="pill pill--outline"
                type="button"
                onClick={copyDraft}
              >
                Sao chép <Icon name="copy" />
              </button>
            </div>
          </section>
        )}
        <p className="contact-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
      {config && (
        <section
          className="google-result"
          hidden={phase === "idle"}
          aria-label="Kết quả gửi yêu cầu"
        >
          <h3>Kết quả từ Google Forms</h3>
          <iframe
            name={target}
            title="Kết quả gửi yêu cầu từ Google Forms"
            src="about:blank"
            onLoad={responseLoaded}
          />
          <a
            className="text-link"
            href={config.formUrl}
            target="_blank"
            rel="noreferrer"
          >
            Mở biểu mẫu trong tab riêng <Icon name="external" />
          </a>
        </section>
      )}
    </div>
  );
};
export default ContactForm;
