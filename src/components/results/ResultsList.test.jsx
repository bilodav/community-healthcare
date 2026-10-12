import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe, renderWithRouter } from "../../test/utils";
import ResultsList from "./ResultsList";

const make = (id, name) => ({
  id,
  name,
  role: "Doctor (General practitioner)",
  profession: "doctor",
  consultations: ["in-person", "virtual"],
  languages: ["english", "isizulu"],
  nextAvailable: "Available today, 09:15",
});

const three = [
  make("mokoena", "Dr Thandi Mokoena"),
  make("sithole", "Dr Mpho Sithole"),
  make("naidoo", "Dr Priya Naidoo"),
];

describe("ResultsList", () => {
  afterEach(() => vi.useRealTimers());

  it("renders a labelled section with the default heading", () => {
    renderWithRouter(<ResultsList practitioners={three} />);

    const region = screen.getByRole("region", {
      name: "Available practitioners",
    });
    expect(region).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Available practitioners" }),
    ).toBeInTheDocument();
  });

  it("accepts a custom title", () => {
    renderWithRouter(<ResultsList practitioners={three} title="Your matches" />);

    expect(
      screen.getByRole("heading", { name: "Your matches" }),
    ).toBeInTheDocument();
  });

  describe("count", () => {
    it("shows the plural count and one card per practitioner", () => {
      renderWithRouter(<ResultsList practitioners={three} />);

      // Both the visible count and the spoken (live region) count
      expect(screen.getAllByText("3 practitioners found")).toHaveLength(2);
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
      expect(
        screen.getByRole("heading", { level: 3, name: "Dr Thandi Mokoena" }),
      ).toBeInTheDocument();
    });

    it("uses the singular for one result", () => {
      renderWithRouter(<ResultsList practitioners={three.slice(0, 1)} />);

      expect(screen.getAllByText("1 practitioner found")).toHaveLength(2);
    });

    it("hides the visible count from assistive tech so it is not read twice", () => {
      renderWithRouter(<ResultsList practitioners={three} />);

      const visible = screen
        .getAllByText("3 practitioners found")
        .find((el) => el.getAttribute("aria-hidden") === "true");
      expect(visible).toBeDefined();
    });

    it("announces the count in a polite live region", () => {
      renderWithRouter(<ResultsList practitioners={three} />);

      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveAttribute("aria-atomic", "true");
      expect(status).toHaveTextContent("3 practitioners found");
    });

    it("updates the visible count at once but waits 800ms to update the spoken count", () => {
      vi.useFakeTimers();
      const { rerender } = render(
        <MemoryRouter>
          <ResultsList practitioners={three} />
        </MemoryRouter>,
      );

      rerender(
        <MemoryRouter>
          <ResultsList practitioners={three.slice(0, 1)} />
        </MemoryRouter>,
      );

      const visible = screen
        .getAllByText(/practitioners? found/)
        .find((el) => el.getAttribute("aria-hidden") === "true");
      expect(visible).toHaveTextContent("1 practitioner found");
      expect(screen.getByRole("status")).toHaveTextContent("3 practitioners found");

      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(screen.getByRole("status")).toHaveTextContent("1 practitioner found");
    });
  });

  describe("empty state", () => {
    it("explains that nothing matched and suggests removing filters", () => {
      renderWithRouter(<ResultsList practitioners={[]} />);

      expect(
        screen.getByText(
          "No practitioners match your search. Try removing some filters.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
      expect(screen.getAllByText("0 practitioners found")).toHaveLength(2);
    });
  });

  it("gives the heading to a ref and makes it focusable so the page can move focus to it", () => {
    const headingRef = { current: null };
    renderWithRouter(<ResultsList practitioners={three} headingRef={headingRef} />);

    expect(headingRef.current).toBe(
      screen.getByRole("heading", { name: "Available practitioners" }),
    );
    headingRef.current.focus();
    expect(headingRef.current).toHaveFocus();
  });

  it("links each card to the booking page for that practitioner", () => {
    renderWithRouter(<ResultsList practitioners={three} />);

    expect(
      screen.getByRole("link", { name: "Book with Dr Mpho Sithole" }),
    ).toHaveAttribute("href", "/booking?practitioner=sithole");
  });

  it("has no accessibility violations with results or without", async () => {
    const full = renderWithRouter(<ResultsList practitioners={three} />);
    expect(await axe(full.container)).toHaveNoViolations();
    full.unmount();

    const empty = renderWithRouter(<ResultsList practitioners={[]} />);
    expect(await axe(empty.container)).toHaveNoViolations();
  });
});
