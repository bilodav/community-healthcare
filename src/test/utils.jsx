import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { configureAxe } from "vitest-axe";

// axe with colour contrast switched off: jsdom does no layout or painting, so
// that rule cannot run here (and floods the output with "not implemented"
// warnings). Contrast is covered by the computed CSS audit and by Lighthouse.
export const axe = configureAxe({
  rules: { "color-contrast": { enabled: false } },
});

// Renders a component inside a router, at a given URL, and returns a
// userEvent instance so tests can type, click and tab like a person would.
export function renderWithRouter(ui, { route = "/" } = {}) {
  return {
    user: userEvent.setup(),
    ...render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>),
  };
}
