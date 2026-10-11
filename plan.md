# Project Issues: Community Healthcare Booking Portal (MD-2026-0143)

Tick each box when done. IDs are stable so commits can reference them (e.g. `fix: #B2`).

Priority key: **P0** = broken or blocks marks, **P1** = required by the brief, **P2** = polish.

---

## E. Part A: Wireframes and planning checks

- [ ] **E1 (P1) Contrast values in `wireframes/main.css` comments**
  - Brief requires computed hex contrast values in CSS comments. The header comment mentions ratios, but ratios were only found in `wcag-matrix.md`. Add `/* #hex on #hex = X:1 */` beside each colour token and text/background pairing.
- [ ] **E2 (P1) Check `:focus-visible` replacement is complete**
  - `main.css` has an `outline: none` on `:focus:not(:focus-visible)`: fine, but confirm every interactive element still gets a visible ring.
- [ ] **E3 (P1) Fill in the verification log**
  - `wireframes/wcag-matrix.md` section 5 is an empty table. Complete it after testing (automated result, manual result, tester, date, pass/fail).
- [ ] **E4 (P2) Keep wireframes and React in sync**
  - Spot-check that landmarks, headings, and labels in `wireframes/*.html` still match the React pages.

---

## F. Tests, audit, and deployment

- [ ] **F1 (P1) Set up testing**
  - Install `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, and `vitest-axe` (or `jest-axe`).
  - Add `"test": "vitest"` to `package.json` and a test config in `vite.config.js`.
- [ ] **F2 (P1) Write component tests**
  - Minimum set: `FormField` (label, hint, error wiring), `BookingForm` (validation, summary, focus), `FilterPanel` (`aria-expanded` toggles), a `aria-pressed` toggle, `ResultsList` (count and empty state), `Header` (menu open, Escape, focus).
  - Add one axe test per page (`expect(await axe(container)).toHaveNoViolations()`).
- [ ] **F3 (P1) Manual testing logs**
  - Keyboard: tab-sequence for each page.
  - Screen reader: NVDA, VoiceOver, or Orca. Note what was announced for the form, filters, and live regions.
  - Save logs in the repo (e.g. `docs/testing-log.md`).
- [ ] **F4 (P1) Lighthouse and axe reports**
  - Run on the built app (`npm run build && npm run preview`). Target 100% Accessibility.
  - Save screenshots or exported reports in `docs/` and link them from the README.
- [ ] **F5 (P1) Deployment config**
  - Add `vercel.json` or `netlify.toml` (or a GitHub Pages workflow) with an SPA fallback so `/booking` and `/listing` work on refresh.
  - Add a live URL to the README.
- [ ] **F6 (P2) Image weight**
  - `docConsulting.jpg` and `embraceOld.jpg` are ~460 KB and ~490 KB each. Compress or convert to WebP.

---

## G. Part C: README (400-600 words)

- [ ] **G1 (P0) Replace the Vite template README**
  - Short intro, how to run, project structure, links to `wireframes/`.
- [ ] **G2 (P1) Accessibility trade-off analysis (3 trade-offs)**
  - Candidates: accordion as button vs. native `<details>`; menu without a focus trap vs. trapped dropdown; live region verbosity (results count) vs. silence; custom form validation vs. native browser validation.
  - Each needs the technical rationale.
- [ ] **G3 (P1) Assistive tech state architecture**
  - Explain how React state maps to `aria-expanded`, `aria-pressed`, `aria-live`, `aria-busy`, `aria-invalid`, and `.focus()` via `useRef`.
- [ ] **G4 (P1) Verification and testing audit**
  - Summary of axe/Lighthouse results (with evidence link) and a summary of manual keyboard and screen reader testing.
- [ ] **G5 (P2) Word count check**
  - Keep Part C within ~400-600 words.

---

## H. Housekeeping and final audit

- [ ] **H1 (P2) Remove or move `plan.txt`**
  - Move into `docs/` or delete once all its checklist items are done.
- [ ] **H2 (P2) Repo structure matches the brief**
  - `/wireframes`: 3 `.html`, `main.css`, `persona.md`, `wcag-matrix.md`
  - Repo root: full React source, component tests, deployment config
  - README contains Part C
- [ ] **H3 (P1) Final pass**
  - `npm run lint` is clean.
  - `npm run test` passes.
  - `npm run build` succeeds and `npm run preview` works.
  - Every box in the original `plan.txt` final audit is ticked.

---

## Suggested order

1. A1, A2, A3, A4, A6 (quick wins, clears lint)
2. B1 to B6 (form validation)
3. D1, D2, D3 (focus management)
4. C1 (`aria-pressed`)
5. F1, F2 (tests)
6. F3, F4, E3 (audit evidence)
7. G1 to G4 (README)
8. F5 (deploy), then everything marked P2
