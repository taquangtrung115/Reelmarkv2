import { test, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "../src/components/ContactForm.jsx";
import {
  googleFormConfig,
  GOOGLE_FORM_FIELDS,
  GOOGLE_FORM_URL,
} from "../src/utilities/google-form.js";

const context = { need: "distribution", product: "premium-fish-balls" };
const fill = async () => {
  await userEvent.type(screen.getByLabelText("Họ và tên *"), "React unit test");
  await userEvent.type(screen.getByLabelText("Email *"), "unit@example.com");
  await userEvent.type(
    screen.getByLabelText("Lời nhắn của bạn"),
    "Kiểm thử, không gửi mạng.",
  );
};

test("the real public Google Form URL resolves to its matching POST endpoint", () => {
  const config = googleFormConfig(GOOGLE_FORM_URL);
  expect(config.responseUrl).toBe(
    GOOGLE_FORM_URL.replace("/viewform", "/formResponse") + "?embedded=true",
  );
  expect(config.fields).toEqual(GOOGLE_FORM_FIELDS);
  expect(new Set(Object.values(config.fields)).size).toBe(7);
});
for (const url of [
  "",
  "not-a-url",
  "http://docs.google.com/forms/d/e/abc/viewform",
  "https://evil.test/forms/d/e/abc/viewform",
  "https://docs.google.com.evil.test/forms/d/e/abc/viewform",
  "https://docs.google.com/forms/d/e/abc/edit",
  "https://user:password@docs.google.com/forms/d/e/abc/viewform",
  "https://docs.google.com:444/forms/d/e/abc/viewform",
  "javascript:alert(1)",
]) {
  test(`rejects an invalid form target: ${url}`, () =>
    expect(googleFormConfig(url)).toBeNull());
}
test("URL normalization removes fragments and arbitrary query parameters", () => {
  expect(
    googleFormConfig(GOOGLE_FORM_URL + "?redirect=evil#fragment").formUrl,
  ).toBe(GOOGLE_FORM_URL);
  expect(
    googleFormConfig("https://docs.google.com/forms/d/abc/viewform/")
      .responseUrl,
  ).toBe("https://docs.google.com/forms/d/abc/formResponse?embedded=true");
});
test("missing or malformed entry IDs cannot silently receive a submission", () => {
  expect(
    googleFormConfig(GOOGLE_FORM_URL, {
      ...GOOGLE_FORM_FIELDS,
      email: "email",
    }),
  ).toBeNull();
  expect(googleFormConfig(GOOGLE_FORM_URL, {})).toBeNull();
});
test("Google mode keeps the original styled fields and maps all seven values to real entry IDs", async () => {
  render(<ContactForm context={context} />);
  await fill();
  const form = screen
    .getByRole("button", { name: "Gửi yêu cầu tư vấn" })
    .closest("form");
  expect(form).toHaveClass("contact-form");
  expect(form).toHaveAttribute("method", "POST");
  expect(form.action).toContain("/formResponse?embedded=true");
  expect(form.target).toBe(
    screen.getByTitle("Kết quả gửi yêu cầu từ Google Forms").name,
  );
  const data = new FormData(form);
  expect(data.get(GOOGLE_FORM_FIELDS.name)).toBe("React unit test");
  expect(data.get(GOOGLE_FORM_FIELDS.email)).toBe("unit@example.com");
  expect(data.get(GOOGLE_FORM_FIELDS.need)).toBe("Hợp tác phân phối thực phẩm");
  expect(data.get(GOOGLE_FORM_FIELDS.product)).toBe("Cá Viên Cao Cấp");
  expect(data.get(GOOGLE_FORM_FIELDS.message)).toBe(
    "Kiểm thử, không gửi mạng.",
  );
  expect(data.get("fvv")).toBe("1");
  expect(data.get("pageHistory")).toBe("0");
});
test("required fields prevent an invalid request before native submission", () => {
  render(<ContactForm context={context} />);
  fireEvent.submit(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }).closest("form"),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Vui lòng kiểm tra");
  expect(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }),
  ).not.toBeDisabled();
});

test("phone validation rejects letters and accepts a formatted optional phone number", async () => {
  render(<ContactForm context={context} />);
  await fill();
  const phone = screen.getByLabelText("Số điện thoại (không bắt buộc)");
  await userEvent.type(phone, "abcdefghij");
  fireEvent.submit(screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }).closest("form"));
  expect(phone).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" })).toBeEnabled();
  await userEvent.clear(phone);
  await userEvent.type(phone, "+84 (90) 123-4567");
  expect(phone.checkValidity()).toBe(true);
});
test("submission prevents double-clicks, preserves entered data and exposes the real Google response", async () => {
  render(<ContactForm context={context} />);
  await fill();
  fireEvent.submit(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }).closest("form"),
  );
  expect(screen.getByRole("button", { name: "Đang gửi…" })).toBeDisabled();
  expect(
    screen.getByRole("region", { name: "Kết quả gửi yêu cầu" }),
  ).toBeVisible();
  fireEvent.load(screen.getByTitle("Kết quả gửi yêu cầu từ Google Forms"));
  expect(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }),
  ).toBeEnabled();
  expect(screen.getByRole("status")).toHaveTextContent("Vui lòng xem xác nhận");
  expect(screen.getByRole("status")).not.toHaveTextContent(
    "Đã lưu vào Google Sheet",
  );
  expect(screen.getByLabelText("Họ và tên *")).toHaveValue("React unit test");
});
test("a response timeout remains honest and permits retry rather than claiming saved data", async () => {
  render(<ContactForm context={context} />);
  await fill();
  vi.useFakeTimers();
  fireEvent.submit(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }).closest("form"),
  );
  act(() => {
    vi.advanceTimersByTime(20001);
  });
  expect(screen.getByRole("status")).toHaveTextContent(
    "Chưa nhận được kết quả",
  );
  expect(
    screen.getByRole("button", { name: "Gửi yêu cầu tư vấn" }),
  ).toBeEnabled();
});
test("an unconfigured form preserves the previous email-draft workflow", async () => {
  render(<ContactForm context={context} formUrl="" />);
  await fill();
  fireEvent.submit(
    screen.getByRole("button", { name: "Soạn email tư vấn" }).closest("form"),
  );
  expect(
    screen.getByRole("link", { name: "Mở ứng dụng email" }),
  ).toHaveAttribute(
    "href",
    expect.stringContaining("mailto:bod@tvsfastfood.com"),
  );
  expect(screen.getByRole("status")).toHaveTextContent("Email chưa được gửi");
  expect(
    screen.queryByTitle("Kết quả gửi yêu cầu từ Google Forms"),
  ).not.toBeInTheDocument();
});
test("changing a product or purpose updates the submitted values without erasing the message", async () => {
  const view = render(<ContactForm context={context} />);
  await fill();
  view.rerender(
    <ContactForm context={{ need: "products", product: "beef-balls" }} />,
  );
  expect(screen.getByLabelText("Bạn quan tâm đến")).toHaveValue(
    "Tư vấn sản phẩm & nơi mua",
  );
  expect(screen.getByLabelText("Món ngon bạn quan tâm")).toHaveValue(
    "Bò viên Tân Việt Sin",
  );
  expect(screen.getByLabelText("Lời nhắn của bạn")).toHaveValue(
    "Kiểm thử, không gửi mạng.",
  );
});
