import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { Link, useLocation, useNavigate } from "react-router";
import { renderWithRouter } from "../test/utils";
import Listing from "./Listing";
import { practitioners } from "../data/practitioners";
import { filterPractitioners } from "../utils/filterPractitioners";
import { withAvailability } from "../utils/availability";
import { paramsToFilters } from "../utils/filterParams";

// Listing stays mounted while the URL changes in these tests, exactly as it
// does when a visitor clicks the header's "Find a service" link or presses
// Back while already on /listing. The harness gives us links to click, a Back
// button, and a read-out of the current query string.
function Harness() {
  const navigate = useNavigate();
  const { search } = useLocation();
  return (
    <>
      <nav aria-label="Test links">
        <Link to="/listing">Plain listing</Link>
        <Link to="/listing?profession=nurse&language=isizulu">Nurses</Link>
        <Link to="/listing?q=mokoena">Search mokoena</Link>
        <Link to="/listing?availability=today&consult=virtual">
          Today and virtual
        </Link>
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </nav>
      <output data-testid="search">{search}</output>
      <Listing />
    </>
  );
}

const renderListing = (route = "/listing") =>
  renderWithRouter(<Harness />, { route });

const searchBox = () =>
  screen.getByRole("searchbox", { name: /search by name or keyword/i });
const toggle = (name) => screen.getByRole("button", { name });
const currentSearch = () => screen.getByTestId("search").textContent;
const countText = (n) => `${n} practitioner${n === 1 ? "" : "s"} found`;

describe("Listing: URL and controls stay in step", () => {
  it("applies the URL on first load", () => {
    renderListing("/listing?profession=doctor&q=thandi");

    expect(toggle("General practitioner")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(searchBox()).toHaveValue("thandi");
  });

  it("updates the toggles when navigation adds filters", async () => {
    const { user } = renderListing("/listing");
    expect(toggle("Nurse")).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("link", { name: "Nurses" }));

    expect(toggle("Nurse")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("checkbox", { name: "isiZulu" })).toBeChecked();
  });

  it("updates the search box when navigation changes ?q=", async () => {
    const { user } = renderListing("/listing");

    await user.click(screen.getByRole("link", { name: "Search mokoena" }));

    expect(searchBox()).toHaveValue("mokoena");
  });

  it("updates the availability and consultation controls", async () => {
    const { user } = renderListing("/listing");

    await user.click(screen.getByRole("link", { name: "Today and virtual" }));

    expect(
      screen.getByRole("radio", { name: "Available today" }),
    ).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /virtual/i })).toBeChecked();
  });

  it("clears the controls when navigation goes to a plain /listing", async () => {
    // This is what the header and footer "Find a service" links do
    const { user } = renderListing("/listing?profession=doctor&q=thandi");
    expect(searchBox()).toHaveValue("thandi");

    await user.click(screen.getByRole("link", { name: "Plain listing" }));

    expect(searchBox()).toHaveValue("");
    expect(toggle("General practitioner")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText(countText(practitioners.length))).toBeVisible();
  });

  it("shows results that match the new URL, not the old one", async () => {
    const { user } = renderListing("/listing");

    await user.click(screen.getByRole("link", { name: "Nurses" }));

    const expected = filterPractitioners(
      practitioners.map(withAvailability),
      paramsToFilters(new URLSearchParams("profession=nurse&language=isizulu")),
    ).length;
    expect(screen.getByText(countText(expected))).toBeVisible();
  });

  it("follows the Back button to the earlier filters", async () => {
    const { user } = renderListing("/listing?profession=doctor");

    await user.click(screen.getByRole("link", { name: "Nurses" }));
    expect(toggle("Nurse")).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(toggle("General practitioner")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(toggle("Nurse")).toHaveAttribute("aria-pressed", "false");
  });

  it("does not write the old filters back over a navigation", async () => {
    // Typing starts the 400 ms URL write. If the visitor navigates before it
    // fires, the stale text must not overwrite the page they just opened.
    const { user } = renderListing("/listing?profession=doctor");
    await user.type(searchBox(), "zzz");

    await user.click(screen.getByRole("link", { name: "Plain listing" }));
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(searchBox()).toHaveValue("");
    expect(toggle("General practitioner")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(currentSearch()).toBe("");
  });
});

describe("Listing: typing still updates the URL", () => {
  it("mirrors typed filters into the URL without losing characters", async () => {
    const { user } = renderListing("/listing");

    await user.type(searchBox(), "mok");
    await waitFor(() => expect(currentSearch()).toBe("?q=mok"));

    // Keep typing after the URL has been rewritten: the URL change must not
    // push the older text back into the box.
    await user.type(searchBox(), "oena");
    await waitFor(() => expect(currentSearch()).toBe("?q=mokoena"));
    expect(searchBox()).toHaveValue("mokoena");
  });

  it("mirrors a toggled profession into the URL", async () => {
    const { user } = renderListing("/listing");

    await user.click(toggle("Nurse"));

    await waitFor(() => expect(currentSearch()).toBe("?profession=nurse"));
    expect(toggle("Nurse")).toHaveAttribute("aria-pressed", "true");
  });
});
