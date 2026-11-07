import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_FIELDS,
  googleFormConfig,
} from "../utilities/google-form.js";

const configuredUrl = import.meta.env.VITE_GOOGLE_FORM_URL ?? GOOGLE_FORM_URL;
export const contactService = Object.freeze({
  getGoogleFormConfig: (url = configuredUrl) =>
    googleFormConfig(url, GOOGLE_FORM_FIELDS),
});
