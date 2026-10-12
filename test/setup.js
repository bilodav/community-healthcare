import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as axeMatchers from "vitest-axe/matchers";

// Adds toBeInTheDocument(), toHaveAttribute(), toHaveFocus() ... (jest-dom)
// and toHaveNoViolations() (axe)
expect.extend(axeMatchers);

// Unmount anything a test rendered, so tests cannot affect each other
afterEach(() => cleanup());

// jsdom does not implement scrolling; our route-focus hook calls this
window.scrollTo = vi.fn();
