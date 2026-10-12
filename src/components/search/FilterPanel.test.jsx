import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../test/utils";
import FilterPanel from "./FilterPanel";
import { emptyFilters } from "../../data/filterOptions";

const setup = (props = {}) => {
  const onChange = vi.fn();
  const onToggle = vi.fn();
  const utils = render(
    <FilterPanel
      values={emptyFilters}
      onChange={onChange}
      onToggle={onToggle}
      {...props}
    />,
  );
  return { user: userEvent.setup(), onChange, onToggle, ...utils };
};

const toggleButton = () => screen.getByRole("button", { name: "Filter results" });

describe("FilterPanel", () => {
  it("starts open by default, with aria-expanded=true", () => {
    setup();

    expect(toggleButton()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("group", { name: "Availability" })).toBeVisible();
  });

  it("can start closed with defaultOpen={false}", () => {
    setup({ defaultOpen: false });

    expect(toggleButton()).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("group", { name: "Availability" }),
    ).not.toBeInTheDocument();
  });

  it("toggles aria-expanded and hides/shows the panel on each click", async () => {
    const { user } = setup();

    await user.click(toggleButton());
    expect(toggleButton()).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("group", { name: "Availability" }),
    ).not.toBeInTheDocument();

    await user.click(toggleButton());
    expect(toggleButton()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("group", { name: "Availability" })).toBeVisible();
  });

  it("toggles from the keyboard with Enter and Space", async () => {
    const { user } = setup();

    await user.tab();
    expect(toggleButton()).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(toggleButton()).toHaveAttribute("aria-expanded", "false");

    await user.keyboard(" ");
    expect(toggleButton()).toHaveAttribute("aria-expanded", "true");
  });

  it("points aria-controls at the panel it shows and hides", async () => {
    const { user } = setup();

    const panel = document.getElementById(
      toggleButton().getAttribute("aria-controls"),
    );
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveAttribute("hidden");

    await user.click(toggleButton());
    expect(panel).toHaveAttribute("hidden");
  });

  it("calls onChange when an availability radio is chosen", async () => {
    const { user, onChange } = setup();

    await user.click(screen.getByRole("radio", { name: "Available today" }));

    expect(onChange).toHaveBeenCalledWith("availability", "today");
  });

  it("calls onToggle when a consultation or language checkbox is ticked", async () => {
    const { user, onToggle } = setup();

    await user.click(screen.getByRole("checkbox", { name: "Virtual (video or phone)" }));
    expect(onToggle).toHaveBeenCalledWith("consult", "virtual");

    await user.click(screen.getByRole("checkbox", { name: "isiZulu" }));
    expect(onToggle).toHaveBeenCalledWith("language", "isizulu");
  });

  it("reflects the current filter values in the controls", () => {
    setup({
      values: {
        ...emptyFilters,
        availability: "week",
        consult: ["in-person"],
        language: ["afrikaans"],
      },
    });

    expect(screen.getByRole("radio", { name: "Available this week" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Any time" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "In person" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Afrikaans" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "English" })).not.toBeChecked();
  });

  it("has no accessibility violations, open or closed", async () => {
    const { container, user } = setup();
    expect(await axe(container)).toHaveNoViolations();

    await user.click(toggleButton());
    expect(await axe(container)).toHaveNoViolations();
  });
});
