import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe, renderWithRouter } from "../test/utils";
import App from "../App";

// One axe scan per page. Each route is rendered through <App />, so the skip
// link, header, page and footer are scanned together, as a visitor gets them.
const renderPage = (route) => renderWithRouter(<App />, { route });

describe("pages: accessibility (axe)", () => {
  it("Landing (/) has no violations", async () => {
    const { container } = renderPage("/");

    expect(
      await screen.findByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing (/listing) has no violations", async () => {
    const { container } = renderPage("/listing");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Find a practitioner" }),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing with filters applied from the URL has no violations", async () => {
    const { container } = renderPage(
      "/listing?profession=doctor&consult=virtual&language=isizulu",
    );

    await screen.findByRole("heading", { level: 1, name: "Find a practitioner" });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing with no matching results has no violations", async () => {
    const { container } = renderPage("/listing?q=zzzzzzzz");

    expect(
      await screen.findByText(/no practitioners match your search/i),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Booking (/booking?practitioner=mokoena) has no violations once slots have loaded", async () => {
    const { container } = renderPage("/booking?practitioner=mokoena");

    // The mock service takes ~700ms to return slots
    expect(
      await screen.findByLabelText(/^date/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Booking while slots are loading has no violations", async () => {
    const { container } = renderPage("/booking?practitioner=mokoena");

    expect(
      screen.getByText(/loading available appointments/i),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    // let the pending request finish inside this test
    await screen.findByLabelText(/^date/i, {}, { timeout: 4000 });
  });

  it("Booking without a practitioner (choose-first view) has no violations", async () => {
    const { container } = renderPage("/booking");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Choose a practitioner first",
      }),
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Not found (unknown URL) has no violations", async () => {
    const { container } = renderPage("/this-page-does-not-exist");

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
