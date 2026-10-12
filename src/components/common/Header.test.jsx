import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe, renderWithRouter } from "../../test/utils";
import Header from "./Header";

const openButton = () => screen.getByRole("button", { name: "Open menu" });
const closeButton = () => screen.getByRole("button", { name: "Close menu" });

describe("Header", () => {
  it("renders the site link and a closed menu button", () => {
    renderWithRouter(<Header />);

    expect(screen.getByRole("link", { name: /muni\s*clinic/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(openButton()).toHaveAttribute("aria-expanded", "false");
    expect(openButton()).toHaveAttribute("aria-controls", "main-nav");
  });

  it("has a main navigation landmark that the menu button controls", () => {
    renderWithRouter(<Header />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toHaveAttribute("id", "main-nav");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find a service" })).toHaveAttribute(
      "href",
      "/listing",
    );
  });

  describe("opening the menu", () => {
    it("sets aria-expanded and changes the button label", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.click(openButton());

      expect(closeButton()).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.queryByRole("button", { name: "Open menu" }),
      ).not.toBeInTheDocument();
    });

    it("opens from the keyboard with Enter and Space", async () => {
      const { user } = renderWithRouter(<Header />);

      openButton().focus();
      await user.keyboard("{Enter}");
      expect(closeButton()).toBeInTheDocument();

      await user.keyboard(" ");
      expect(openButton()).toBeInTheDocument();
    });

    it("closes when the button is clicked again", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.click(openButton());
      await user.click(closeButton());

      expect(openButton()).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Escape", () => {
    it("closes the menu and returns focus to the menu button", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.click(openButton());
      // Move into the menu so we can prove focus really comes back
      await user.tab();
      expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

      await user.keyboard("{Escape}");

      const button = openButton();
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveFocus();
    });

    it("does nothing when the menu is already closed", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.keyboard("{Escape}");

      expect(openButton()).toHaveAttribute("aria-expanded", "false");
      expect(openButton()).not.toHaveFocus();
    });
  });

  describe("focus", () => {
    it("is not trapped: Tab moves from the button into the menu links", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.click(openButton());
      await user.tab();
      expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: "Find a service" })).toHaveFocus();
      // Menu is still open while focus is inside the header
      expect(closeButton()).toHaveAttribute("aria-expanded", "true");
    });

    it("closes the menu when focus moves outside the header", async () => {
      const { user } = renderWithRouter(
        <>
          <Header />
          <button type="button">Outside</button>
        </>,
      );

      await user.click(openButton());
      // Tab through the two menu links and out of the header
      await user.tab();
      await user.tab();
      await user.tab();
      expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();

      expect(openButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes the menu when the page outside the header is clicked", async () => {
      const { user } = renderWithRouter(
        <>
          <Header />
          <p>Page content</p>
        </>,
      );

      await user.click(openButton());
      await user.click(screen.getByText("Page content"));

      expect(openButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("closes the menu after a navigation link is chosen", async () => {
      const { user } = renderWithRouter(<Header />);

      await user.click(openButton());
      await user.click(screen.getByRole("link", { name: "Find a service" }));

      expect(openButton()).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("has no accessibility violations, menu closed or open", async () => {
    const { container, user } = renderWithRouter(<Header />);
    expect(await axe(container)).toHaveNoViolations();

    await user.click(openButton());
    expect(await axe(container)).toHaveNoViolations();
  });
});
