export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScteoJPEL9WWLHUgYZeKCZE-yfRCZfAMtGrWie7aaz2K_cAhQ/viewform";
export const GOOGLE_FORM_FIELDS = Object.freeze({
  name: "entry.1729877786",
  email: "entry.1792482000",
  phone: "entry.428022152",
  company: "entry.1240945126",
  need: "entry.676476999",
  product: "entry.2099369279",
  message: "entry.2067469081",
});

export function googleFormConfig(rawUrl, fields = GOOGLE_FORM_FIELDS) {
  try {
    const url = new URL(rawUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "docs.google.com" ||
      url.username ||
      url.password ||
      url.port ||
      !/^\/forms\/d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname)
    )
      return null;
    if (
      !Object.keys(GOOGLE_FORM_FIELDS).every((key) =>
        /^entry\.\d+$/.test(fields[key]),
      )
    )
      return null;
    url.hash = "";
    url.search = "";
    const response = new URL(url);
    response.pathname = response.pathname.replace(
      /viewform\/?$/,
      "formResponse",
    );
    response.searchParams.set("embedded", "true");
    return { formUrl: url.href, responseUrl: response.href, fields };
  } catch {
    return null;
  }
}
