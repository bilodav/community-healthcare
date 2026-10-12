import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "../../test/utils";
import BookingForm from "./BookingForm";

// Fixed slots so the tests never depend on today's date or the mock service
const slots = [
  { id: "a|2030-01-07T09:15", date: "2030-01-07", time: "09:15", start: "2030-01-07T09:15" },
  { id: "a|2030-01-07T10:00", date: "2030-01-07", time: "10:00", start: "2030-01-07T10:00" },
  { id: "a|2030-01-08T08:30", date: "2030-01-08", time: "08:30", start: "2030-01-08T08:30" },
];

function setup(props = {}) {
  const onSubmit = vi.fn();
  const onInvalid = vi.fn();
  const utils = render(
    <>
      <h1 id="title">Book an appointment</h1>
      <BookingForm
        labelledBy="title"
        slots={slots}
        slotsStatus="ready"
        onSubmit={onSubmit}
        onInvalid={onInvalid}
        {...props}
      />
    </>,
  );
  return { user: userEvent.setup(), onSubmit, onInvalid, ...utils };
}

const submit = (user) =>
  user.click(screen.getByRole("button", { name: "Confirm booking" }));

const summary = () => screen.getByRole("group", { name: "There is a problem" });

// Fills every field with valid data
async function fillValidForm(user) {
  await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");
  await user.click(screen.getByRole("radio", { name: "09:15" }));
  await user.type(screen.getByLabelText(/first name/i), "Thandi");
  await user.type(screen.getByLabelText(/last name/i), "Mokoena");
  await user.type(screen.getByLabelText(/cellphone/i), "082 123 4567");
  await user.type(screen.getByLabelText(/email/i), "thandi@example.org");
  await user.selectOptions(
    screen.getByLabelText(/type of appointment/i),
    "consult",
  );
}

describe("BookingForm", () => {
  describe("structure", () => {
    it("is a form named by the page heading", () => {
      setup();

      expect(
        screen.getByRole("form", { name: "Book an appointment" }),
      ).toBeInTheDocument();
    });

    it("labels every field and groups them in fieldsets", () => {
      setup();

      expect(screen.getByLabelText(/^date/i)).toBeRequired();
      expect(screen.getByLabelText(/first name/i)).toBeRequired();
      expect(screen.getByLabelText(/last name/i)).toBeRequired();
      expect(screen.getByLabelText(/cellphone/i)).toHaveAttribute("type", "tel");
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
      expect(screen.getByLabelText(/type of appointment/i)).toBeRequired();
      expect(screen.getByLabelText(/support or adjustments/i)).not.toBeRequired();

      expect(screen.getByRole("group", { name: "Your details" })).toBeInTheDocument();
      expect(
        screen.getByRole("group", { name: "Appointment details" }),
      ).toBeInTheDocument();
    });

    it("gives the cellphone and email fields their hints", () => {
      setup();

      expect(screen.getByLabelText(/cellphone/i)).toHaveAccessibleDescription(
        /082 123 4567/,
      );
      expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription(
        /booking confirmation/i,
      );
    });

    it("starts with 'No, this is my first visit' selected", () => {
      setup();

      expect(
        screen.getByRole("radio", { name: "No, this is my first visit" }),
      ).toBeChecked();
    });

    it("has no error summary before the first submit", () => {
      setup();

      expect(
        screen.queryByRole("group", { name: "There is a problem" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("slot picker", () => {
    it("lists each day with its number of times", () => {
      setup();

      const date = screen.getByLabelText(/^date/i);
      expect(within(date).getByRole("option", { name: /\(2 times\)/ })).toBeInTheDocument();
      expect(within(date).getByRole("option", { name: /\(1 time\)/ })).toBeInTheDocument();
    });

    it("only offers times once a date is chosen, and only that day's times", async () => {
      const { user } = setup();
      expect(screen.queryByRole("radio", { name: "09:15" })).not.toBeInTheDocument();

      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");

      expect(screen.getByRole("radio", { name: "09:15" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "10:00" })).toBeInTheDocument();
      expect(screen.queryByRole("radio", { name: "08:30" })).not.toBeInTheDocument();
    });

    it("clears the chosen time when the date changes", async () => {
      const { user } = setup();

      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");
      await user.click(screen.getByRole("radio", { name: "09:15" }));
      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-08");

      expect(screen.getByRole("radio", { name: "08:30" })).not.toBeChecked();
    });

    it("shows a loading message while slots load", () => {
      setup({ slots: [], slotsStatus: "loading" });

      expect(screen.getByText(/loading available appointments/i)).toBeInTheDocument();
    });

    it("offers a retry button when slots fail to load", async () => {
      const onRetrySlots = vi.fn();
      const { user } = setup({ slots: [], slotsStatus: "error", onRetrySlots });

      expect(screen.getByText(/couldn't load the available appointments/i)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Try again" }));

      expect(onRetrySlots).toHaveBeenCalledTimes(1);
    });

    it("tells the person to phone reception when there are no slots", () => {
      setup({ slots: [] });

      expect(screen.getByText(/no appointments available in the next two weeks/i)).toBeInTheDocument();
    });
  });

  describe("validation on submit", () => {
    it("does not submit an empty form, and reports how many fields need attention", async () => {
      const { user, onSubmit, onInvalid } = setup();

      await submit(user);

      expect(onSubmit).not.toHaveBeenCalled();
      // date, first name, last name, cellphone, email, appointment type
      expect(onInvalid).toHaveBeenCalledWith(6);
    });

    it("shows an error summary listing each problem in on-screen order", async () => {
      const { user } = setup();

      await submit(user);

      const links = within(summary()).getAllByRole("link");
      expect(links.map((l) => l.textContent)).toEqual([
        "Select a date for your appointment.",
        "Enter your first name.",
        "Enter your last name.",
        "Enter your cellphone number, for example 082 123 4567.",
        "Enter your email address, for example name@example.org.",
        "Select a type of appointment from the list.",
      ]);
    });

    it("moves focus to the error summary", async () => {
      const { user } = setup();

      await submit(user);

      expect(summary()).toHaveFocus();
    });

    it("shows the error next to each invalid field and marks it aria-invalid", async () => {
      const { user } = setup();

      await submit(user);

      const firstName = screen.getByLabelText(/first name/i);
      expect(firstName).toHaveAttribute("aria-invalid", "true");
      expect(firstName).toHaveAccessibleDescription(/Enter your first name\./);
    });

    it("does not demand a time before a date has been chosen", async () => {
      const { user } = setup();

      await submit(user);

      expect(
        within(summary()).queryByText(/select a time/i),
      ).not.toBeInTheDocument();
    });

    it("asks for a time once a date is chosen but no time is", async () => {
      const { user, onInvalid } = setup();

      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");
      await submit(user);

      expect(
        within(summary()).getByText("Select a time for your appointment."),
      ).toBeInTheDocument();
      // everything except the date is now missing: time + 5 others
      expect(onInvalid).toHaveBeenCalledWith(6);
    });

    it("jumps focus to the field when a summary link is activated", async () => {
      const { user } = setup();
      await submit(user);

      await user.click(
        within(summary()).getByRole("link", { name: "Enter your last name." }),
      );

      expect(screen.getByLabelText(/last name/i)).toHaveFocus();
    });

    it("focuses the first radio when the summary links to the time group", async () => {
      const { user } = setup();
      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");
      await submit(user);

      await user.click(
        within(summary()).getByRole("link", {
          name: "Select a time for your appointment.",
        }),
      );

      expect(screen.getByRole("radio", { name: "09:15" })).toHaveFocus();
    });

    it("moves focus to the summary again on every failed attempt", async () => {
      const { user } = setup();
      await submit(user);
      screen.getByLabelText(/first name/i).focus();

      await submit(user);

      expect(summary()).toHaveFocus();
    });

    it("rejects a cellphone number that is not a South African mobile", async () => {
      const { user } = setup();
      await fillValidForm(user);
      const phone = screen.getByLabelText(/cellphone/i);
      await user.clear(phone);
      await user.type(phone, "012 345 6789"); // landline

      await submit(user);

      expect(
        within(summary()).getByText(/enter a south african cellphone number/i),
      ).toBeInTheDocument();
    });

    it("rejects a badly formed email address", async () => {
      const { user } = setup();
      await fillValidForm(user);
      const email = screen.getByLabelText(/email/i);
      await user.clear(email);
      await user.type(email, "not-an-email");

      await submit(user);

      expect(
        within(summary()).getByText("Enter an email address in the format name@example.org."),
      ).toBeInTheDocument();
    });
  });

  describe("validation while filling in", () => {
    it("does not show an error while the person is still typing in a field", async () => {
      const { user } = setup();

      await user.click(screen.getByLabelText(/first name/i));
      await user.type(screen.getByLabelText(/first name/i), "T");

      expect(screen.getByLabelText(/first name/i)).not.toHaveAttribute("aria-invalid");
    });

    it("shows the error when a required field is left, then clears it as soon as it is fixed", async () => {
      const { user } = setup();
      const firstName = screen.getByLabelText(/first name/i);

      await user.click(firstName);
      await user.tab(); // leave it empty
      expect(firstName).toHaveAttribute("aria-invalid", "true");
      expect(firstName).toHaveAccessibleDescription(/Enter your first name\./);

      await user.type(firstName, "T");

      expect(firstName).not.toHaveAttribute("aria-invalid");
    });

    it("does not open the error summary from blur alone", async () => {
      const { user } = setup();

      await user.click(screen.getByLabelText(/first name/i));
      await user.tab();

      expect(
        screen.queryByRole("group", { name: "There is a problem" }),
      ).not.toBeInTheDocument();
    });

    it("removes an item from the summary once that field has been fixed", async () => {
      const { user } = setup();
      await submit(user);
      expect(within(summary()).getAllByRole("link")).toHaveLength(6);

      await user.selectOptions(screen.getByLabelText(/^date/i), "2030-01-07");
      await user.click(screen.getByRole("radio", { name: "09:15" }));
      await user.type(screen.getByLabelText(/first name/i), "Thandi");
      await user.tab(); // blur, so it is validated
      // Fields not yet visited keep their error; the visited-and-fixed ones go
      expect(
        within(summary()).queryByText("Enter your first name."),
      ).not.toBeInTheDocument();
    });
  });

  describe("successful submit", () => {
    it("calls onSubmit with the values and shows no errors", async () => {
      const { user, onSubmit, onInvalid } = setup();
      await fillValidForm(user);
      await user.type(
        screen.getByLabelText(/support or adjustments/i),
        "Step-free access",
      );

      await submit(user);

      expect(onInvalid).not.toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        date: "2030-01-07",
        slot: "2030-01-07T09:15",
        firstName: "Thandi",
        lastName: "Mokoena",
        contactNumber: "082 123 4567",
        email: "thandi@example.org",
        appointment: "consult",
        visited: "no",
        supportNeeds: "Step-free access",
      });
      expect(
        screen.queryByRole("group", { name: "There is a problem" }),
      ).not.toBeInTheDocument();
    });

    it("accepts a +27 number", async () => {
      const { user, onSubmit } = setup();
      await fillValidForm(user);
      const phone = screen.getByLabelText(/cellphone/i);
      await user.clear(phone);
      await user.type(phone, "+27 82 123 4567");

      await submit(user);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("while submitting", () => {
    it("shows a busy state and changes the button text", () => {
      setup({ submitting: true });

      expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "true");
      expect(
        screen.getByRole("button", { name: "Sending your booking…" }),
      ).toHaveAttribute("aria-disabled", "true");
    });

    it("ignores a second submit so the booking is not sent twice", async () => {
      const { user, onSubmit, onInvalid } = setup({ submitting: true });
      await fillValidForm(user);

      await user.click(screen.getByRole("button", { name: /sending your booking/i }));

      expect(onSubmit).not.toHaveBeenCalled();
      expect(onInvalid).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no violations when pristine", async () => {
      const { container } = setup();

      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with the error summary showing", async () => {
      const { container, user } = setup();
      await submit(user);

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
