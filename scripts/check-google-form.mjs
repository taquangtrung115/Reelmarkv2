import assert from "node:assert/strict";
import {
  GOOGLE_FORM_FIELDS,
  GOOGLE_FORM_URL,
  googleFormConfig,
} from "../src/utilities/google-form.js";

// Read-only smoke check. Real submissions belong to an explicitly labelled browser QA run.
const config = googleFormConfig(
  process.env.VITE_GOOGLE_FORM_URL ?? GOOGLE_FORM_URL,
);
assert.ok(config, "A valid public Google Form URL is required.");
const response = await fetch(config.formUrl, {
  signal: AbortSignal.timeout(20000),
});
assert.ok(response.ok, `Google Form returned HTTP ${response.status}.`);
const html = await response.text();
const match = html.match(
  /(?:var\s+)?FB_PUBLIC_LOAD_DATA_\s*=\s*([\s\S]*?);\s*<\/script>/,
);
assert.ok(
  match,
  "The public form schema is unavailable; check publication and sign-in restrictions.",
);
const schema = JSON.parse(match[1]);
const questions = schema[1][1];
for (const [field, entry] of Object.entries(GOOGLE_FORM_FIELDS)) {
  const question = questions.find((item) =>
    item[4]?.some((answer) => `entry.${answer[0]}` === entry),
  );
  assert.ok(
    question,
    `Missing field ${field}: ${entry}. Update the entry mapping after replacing a question.`,
  );
  assert.ok(
    [0, 1].includes(question[3]),
    `${field} must remain a short-answer or paragraph question.`,
  );
}
assert.ok(
  html.includes(config.responseUrl.split("?")[0]),
  "The form action no longer matches the configured endpoint.",
);
console.info(
  "PASS: public Google Form is reachable; all 7 entry IDs and the POST endpoint match. No data was submitted.",
);
