# Community Clinic: Accessible Healthcare Booking Portal

Ticket MD-2026-0143 · Marlowe Digital · React 19 + Vite + React Router

**Live prototype:** https://bilodav.github.io/community-healthcare/

A clinic directory and appointment booking prototype that works fully by keyboard and screen reader. Users search and filter practitioners, then book a time through an accessible form with live validation.

| Folder             | Contents                                                                          |
| ------------------ | --------------------------------------------------------------------------------- |
| `/wireframes`      | Part A: three semantic HTML/CSS pages, `main.css`, `persona.md`, `wcag-matrix.md` |
| `/src`             | Part B: React app, with component tests next to each component                    |
| `/docs/lighthouse` | Saved Lighthouse reports                                                          |

```bash
npm install
npm run dev        # local development
npm run test:run   # run the test suite once
npm run build      # production build into dist/
```

The site deploys to GitHub Pages through GitHub Actions on every push to `main`. The workflow runs the tests before it builds.

---

## 1. Accessibility trade-offs

**Disclosure menu instead of a focus trap.** The mobile menu is a disclosure, not a modal, so it has no focus trap. `Esc` closes it and returns focus to the burger button, and tabbing or clicking outside also closes it. A trap would be wrong here because the page behind stays usable, and it risks breaking WCAG 2.1.2 (No Keyboard Trap).

**Live region verbosity versus silence.** Announcing every change would flood screen reader users. The results count is therefore debounced by 800 ms, so typing "mokoena" gives one announcement, not seven. The visible count is `aria-hidden` to avoid a double reading. When a focus move already says everything (the confirmation heading), `clear()` empties the live regions. The cost is a short delay before the count is spoken.

**Custom validation instead of native browser bubbles.** The form uses `noValidate`. Native messages cannot be linked to fields or collected into one list, so I validate on blur and on submit, then show an error summary. The cost is writing and testing the validation myself. Native controls (`select`, radios, checkboxes, `fieldset`/`legend`) are kept and only restyled, because they give free keyboard and screen reader behaviour. The submit button uses `aria-disabled` rather than `disabled`, so it stays focusable while sending.

## 2. Assistive technology state architecture

React state is the single source of truth, and attributes are derived from it during render, so the accessibility tree cannot drift from what is on screen.

- **Booleans to ARIA:** `open` drives `aria-expanded` on the filter accordion and menu; `pressed` drives `aria-pressed` on the profession toggles; `submitting` and the slot-loading status drive `aria-busy`.
- **Fields:** `FormField` takes `error` and `hint` props and derives `aria-invalid` and `aria-describedby` (hint first, then error) from them.
- **Announcements:** the `useAnnouncer` hook holds polite and assertive strings, rendered into `LiveRegions`. Both regions are mounted from first paint, because screen readers only announce changes inside regions that already exist. A trailing non-breaking space forces repeated messages to be read again.
- **Focus:** `useRef` plus `useEffect` moves focus after state changes. A failed submit focuses the error summary, a route change focuses the new `<h1>` (`useRouteFocus`), a search submit focuses the results heading, and resetting the booking returns focus to the page heading.
- **Filters** live in state and are mirrored to the URL (debounced), so filtered views can be shared.

## 3. Verification and testing audit

**Automated.** Lighthouse 13.5.0 was run on the production build (mobile) for Landing, Listing, Booking and the 404 page. The Booking confirmation page was run in snapshot mode (Lighthouse 13.4.1, desktop). **All five pages scored 100 for Accessibility**, and the reports are in `docs/lighthouse/`. axe-core found 0 violations on all three wireframes. The React app has 93 Vitest tests across 8 files, including `vitest-axe` checks on each page.

**Manual.** Tested keyboard-only (mouse unplugged) with **Orca + Firefox on Linux**. The actual Tab order matched the expected order on all six flows: landing, listing, booking form, confirmation, failed submit and burger menu. All nine screen reader tasks announced as expected, including toggle state, the single debounced result count, and the "booking was not submitted" alert. Testing also found and fixed real defects, such as 2.05:1 header contrast and a hero button that crashed on activation.

**Limits.** NVDA and VoiceOver were not tested, since they need Windows and macOS. Automated tools catch only part of WCAG, so these results support the claims but do not prove full conformance. Full logs, with all 8 logged defect fixes and a per-criterion matrix, are in `wireframes/wcag-matrix.md`.
