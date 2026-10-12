import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "../../test/utils";
import FormField from "./FormField";

describe("FormField", () => {
  describe("label", () => {
    it("connects the label to the input", () => {
      render(<FormField label="First name" name="firstName" />);

      const input = screen.getByLabelText("First name");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", "firstName");
    });

    it("shows (required) in the label and sets required on the control", () => {
      render(<FormField label="Email" name="email" required />);

      const input = screen.getByLabelText(/email/i);
      expect(input).toBeRequired();
      expect(screen.getByText("(required)")).toBeInTheDocument();
    });

    it("does not mark an optional field as required", () => {
      render(<FormField label="Notes" name="notes" />);

      expect(screen.getByLabelText("Notes")).not.toBeRequired();
      expect(screen.queryByText("(required)")).not.toBeInTheDocument();
    });

    it("uses the id prop when one is given, so an error summary can link to it", () => {
      render(<FormField label="First name" name="firstName" id="booking-firstName" />);

      expect(screen.getByLabelText("First name")).toHaveAttribute(
        "id",
        "booking-firstName",
      );
    });

    it("renders as a select or textarea through the `as` prop", () => {
      const { rerender } = render(
        <FormField as="select" label="Type" name="type">
          <option value="a">A</option>
        </FormField>,
      );
      expect(screen.getByRole("combobox", { name: "Type" })).toBeInTheDocument();

      rerender(<FormField as="textarea" label="Notes" name="notes" />);
      expect(screen.getByRole("textbox", { name: "Notes" }).tagName).toBe(
        "TEXTAREA",
      );
    });
  });

  describe("hint", () => {
    it("is announced as the field's description", () => {
      render(
        <FormField label="Cellphone" name="phone" hint="For example 082 123 4567" />,
      );

      const input = screen.getByLabelText("Cellphone");
      expect(input).toHaveAccessibleDescription("For example 082 123 4567");
      expect(input.getAttribute("aria-describedby")).toBe(
        screen.getByText("For example 082 123 4567").id,
      );
    });

    it("leaves aria-describedby off when there is no hint or error", () => {
      render(<FormField label="Name" name="name" />);

      expect(screen.getByLabelText("Name")).not.toHaveAttribute(
        "aria-describedby",
      );
    });
  });

  describe("error", () => {
    it("marks the field invalid and describes it with the error", () => {
      render(
        <FormField label="Email" name="email" error="Enter your email address." />,
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription(
        /Error: Enter your email address\./,
      );
    });

    it("prefixes the visible error with 'Error:' and hides the warning icon from screen readers", () => {
      const { container } = render(
        <FormField label="Email" name="email" error="Enter your email address." />,
      );

      expect(screen.getByText(/^Error: Enter your email address\.$/)).toBeVisible();
      expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("⚠");
    });

    it("is not marked invalid when there is no error", () => {
      render(<FormField label="Email" name="email" />);

      expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
    });

    it("lists the hint first and the error second in aria-describedby", () => {
      render(
        <FormField
          label="Cellphone"
          name="phone"
          hint="For example 082 123 4567"
          error="Enter your cellphone number."
        />,
      );

      const input = screen.getByLabelText("Cellphone");
      const [hintId, errorId] = input.getAttribute("aria-describedby").split(" ");

      expect(document.getElementById(hintId)).toHaveTextContent(
        "For example 082 123 4567",
      );
      expect(document.getElementById(errorId)).toHaveTextContent(
        "Enter your cellphone number.",
      );
    });
  });

  it("has no accessibility violations with a hint and an error", async () => {
    const { container } = render(
      <FormField
        label="Email"
        name="email"
        required
        hint="We will send your confirmation here."
        error="Enter your email address."
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
