// Runs axe-core against the static wireframes in jsdom.
//   npm i -D axe-core jsdom
//   node scripts/a11y-wireframes.mjs
// Exits with code 1 if any page has an axe violation, so it can run in CI.
//
// jsdom does no layout or painting, so the colour-contrast rule is turned off
// here. Contrast is checked separately (see the CONTRAST AUDIT block in
// wireframes/main.css) and in a real browser with Lighthouse or axe DevTools.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const axeVersion = require("axe-core/package.json").version;
const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "wireframes",
);
const pages = ["landing.html", "listing.html", "booking.html"];

console.log(
  `axe-core ${axeVersion} (jsdom), tags: wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice`,
);
let failed = false;

for (const page of pages) {
  const dom = await JSDOM.fromFile(path.join(dir, page), {
    runScripts: "outside-only",
    resources: "usable",
    pretendToBeVisual: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 400)); // let local CSS load
  const { window } = dom;
  window.eval(axeSource);

  const results = await window.axe.run(window.document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
    },
    rules: { "color-contrast": { enabled: false } },
  });

  console.log(
    `\n${page}: ${results.violations.length} violations, ${results.passes.length} rules passed, ` +
      `${results.incomplete.length} needs review`,
  );
  for (const v of results.violations) {
    failed = true;
    console.log(`  VIOLATION [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3))
      console.log(`    ${node.html.slice(0, 120)}`);
  }
  for (const v of results.incomplete)
    console.log(`  needs review: ${v.id} (${v.nodes.length})`);
  window.close();
}

process.exit(failed ? 1 : 0);
