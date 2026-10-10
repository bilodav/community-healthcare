# Project Issues: Community Healthcare Booking Portal (MD-2026-0143)

Tick each box when done. IDs are stable so commits can reference them (e.g. `fix: #B2`).

Priority key: **P0** = broken or blocks marks, **P1** = required by the brief, **P2** = polish.

---

## C. Part B.2: Filterable listing with ARIA state

- [ ] **C1 (P1) Add `aria-pressed` toggle buttons**
  - Brief requires `aria-pressed` explicitly. Suggested: category pills on the listing page (filter by profession) and/or a "Virtual only" toggle.
  - Must update in real time and visually reflect state without relying on colour alone.
- [ ] **C2 (P1) Search runs while typing or on a clear trigger**
  - Decide whether the form stays submit-based or filters live. If live, keep the results count announcement polite and debounced (avoid spamming screen readers).
- [ ] **C3 (P2) Filter panel keeps its open state after search**
  - `key={searchParams.toString()}` on `SearchForm` remounts it, so the panel resets to open. Consider lifting that state or dropping the key.
- [ ] **C4 (P2) Loading state with `aria-busy`**
  - Brief (Part C) asks how `aria-busy` is used. Add it to the results list during a simulated search delay.
- [ ] **C5 (P2) Services and Triage cards link to filtered results**
  - Confirm that `/listing?urgency=...` and the services links actually change what the listing shows (the filter logic doesn't read `urgency` or `service` yet).

---

## D. Part B.3: Keyboard navigation and focus management

- [ ] **D1 (P1) Focus on route change**
  - On navigation, move focus to `<main>` (or the page `h1`) with `useRef` + `useEffect` keyed on `useLocation()`, so keyboard and screen reader users aren't left on the old link.
  - Also announce the new page title.
- [ ] **D2 (P1) Burger menu focus behaviour**
  - File: `src/components/common/Header.jsx`
  - Escape closes the menu: also return focus to the burger button.
  - Decide and document the focus approach (trap vs. no trap). This is a good trade-off for the README.
- [ ] **D3 (P1) Focus after search**
  - After submitting a search, move focus to the results heading or count so the result is discoverable.
- [ ] **D4 (P1) Optional modal for booking confirmation**
  - If a dialog is used, it needs: focus moves in on open, Escape closes, focus returns to the trigger, background inert. Prefer native `<dialog>` with `showModal()`.
- [ ] **D5 (P1) Full keyboard walkthrough**
  - Tab through every page, check order, check no traps, confirm Space and Enter activate every control. Record in the test log (see F3).
- [ ] **D6 (P2) Scroll listener**
  - `Header.jsx` scroll listener: add `{ passive: true }`.

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
