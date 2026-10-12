import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../test/utils";
import ToggleButton from "./ToggleButton";
import ToggleGroup from "../search/ToggleGroup";

describe("ToggleButton", () => {
  it("reports aria-pressed=false when off and true when on", () => {
    const { rerender } = render(
      <ToggleButton pressed={false} onClick={() => {}}>
        Doctor
      </ToggleButton>,
    );
    expect(screen.getByRole("button", { name: "Doctor" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    rerender(
      <ToggleButton pressed onClick={() => {}}>
        Doctor
      </ToggleButton>,
    );
    expect(screen.getByRole("button", { name: "Doctor" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps the same accessible name in both states", () => {
    const { rerender } = render(
      <ToggleButton pressed={false} onClick={() => {}}>
        Nurse
      </ToggleButton>,
    );
    expect(screen.getByRole("button", { name: "Nurse" })).toBeInTheDocument();

    rerender(
      <ToggleButton pressed onClick={() => {}}>
        Nurse
      </ToggleButton>,
    );
    // The ✓ / + icon is aria-hidden, so it never leaks into the name
    expect(screen.getByRole("button", { name: "Nurse" })).toBeInTheDocument();
  });

  it("calls onClick when clicked, and from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ToggleButton pressed={false} onClick={onClick}>
        Doctor
      </ToggleButton>,
    );

    await user.click(screen.getByRole("button", { name: "Doctor" }));
    // The click leaves focus on the button, so the keys go to it too
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });
});

describe("ToggleGroup", () => {
  const options = [
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "pharmacist", label: "Pharmacist" },
  ];

  it("is a labelled group with a hint", () => {
    render(
      <ToggleGroup
        legend="Profession"
        hint="Select any to narrow the results."
        options={options}
        values={[]}
        onToggle={() => {}}
      />,
    );

    const group = screen.getByRole("group", { name: "Profession" });
    expect(group).toHaveAccessibleDescription("Select any to narrow the results.");
  });

  it("presses only the buttons whose values are selected", () => {
    render(
      <ToggleGroup
        legend="Profession"
        options={options}
        values={["nurse"]}
        onToggle={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Doctor" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Nurse" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Pharmacist" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onToggle with the value of the clicked button", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ToggleGroup
        legend="Profession"
        options={options}
        values={[]}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Pharmacist" }));

    expect(onToggle).toHaveBeenCalledWith("pharmacist");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ToggleGroup
        legend="Profession"
        hint="Select any."
        options={options}
        values={["doctor"]}
        onToggle={() => {}}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
