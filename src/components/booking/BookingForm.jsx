import { useEffect, useRef, useState } from "react";
import styles from "./BookingForm.module.css";
import FormSection from "../forms/FormSection";
import FormField from "../forms/FormField";
import RadioGroup from "../forms/RadioGroup";
import ErrorSummary from "../forms/ErrorSummary";
import SlotPicker from "./SlotPicker";
import {
  appointmentTypes,
  visitedOptions,
  emptyBooking,
} from "../../data/bookingOptions";
import {
  validateField,
  validateAll,
  validatedFields,
} from "../../utils/validateBooking";

// Stable ids so the error summary links can point at each field
const fieldId = (name) => `booking-${name}`;

function BookingForm({
  labelledBy,
  onSubmit,
  onInvalid,
  submitting = false,
  slots,
  slotsStatus,
  onRetrySlots,
}) {
  const [values, setValues] = useState(emptyBooking);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const summaryRef = useRef(null);

  // A chosen time only counts while it is still in the list of open slots
  // (for example it disappears if the slots are reloaded after a conflict)
  const current = {
    ...values,
    slot: slots.some((s) => s.start === values.slot) ? values.slot : "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...current, [name]: value };
    if (name === "date") next.slot = ""; // times belong to a date

    setValues(next);

    // Once a field has been visited, re-check as the person types,
    // so the error disappears the moment it's fixed
    setErrors((errs) => {
      const updated = { ...errs };
      if (touched[name]) updated[name] = validateField(name, value, next);
      if (name === "date") updated.slot = "";
      return updated;
    });
  };

  // Validate when leaving a field, not while the person is still typing in it
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((errs) => ({
      ...errs,
      [name]: validateField(name, value, { ...current, [name]: value }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = validateAll(current);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));

    if (Object.keys(found).length > 0) {
      setSubmitAttempts((n) => n + 1);
      onInvalid?.(Object.keys(found).length);
      return;
    }
    onSubmit?.(current);
  };

  // After a failed submit, move focus to the summary. It is already rendered,
  // because errors and submitAttempts update in the same event.
  useEffect(() => {
    if (submitAttempts > 0) summaryRef.current?.focus();
  }, [submitAttempts]);

  // Summary items follow on-screen field order
  const summaryItems = validatedFields
    .filter((name) => errors[name])
    .map((name) => ({ id: fieldId(name), message: errors[name] }));

  const showSummary = submitAttempts > 0 && summaryItems.length > 0;

  // Props shared by every controlled field
  const bind = (name) => ({
    id: fieldId(name),
    name,
    value: current[name],
    error: errors[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form
      className={styles["form"]}
      onSubmit={handleSubmit}
      aria-labelledby={labelledBy}
      aria-busy={submitting}
      noValidate
    >
      {showSummary && <ErrorSummary ref={summaryRef} errors={summaryItems} />}

      <SlotPicker
        slots={slots}
        status={slotsStatus}
        selectedDate={current.date}
        dateProps={bind("date")}
        slotProps={bind("slot")}
        onRetry={onRetrySlots}
      />

      <FormSection legend="Your details">
        <FormField
          label="First name"
          autoComplete="given-name"
          required
          {...bind("firstName")}
        />

        <FormField
          label="Last name"
          autoComplete="family-name"
          required
          {...bind("lastName")}
        />

        <FormField
          label="Cellphone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          hint="We will send your reminder here. For example: 082 123 4567."
          required
          {...bind("contactNumber")}
        />

        <FormField
          label="Email address"
          type="email"
          autoComplete="email"
          hint="We will send your booking confirmation here."
          required
          {...bind("email")}
        />
      </FormSection>

      <FormSection legend="Appointment details">
        <FormField
          as="select"
          label="Type of appointment"
          required
          {...bind("appointment")}
        >
          <option value="">Select an appointment type</option>
          {appointmentTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>

        <RadioGroup
          legend="Have you visited this practice before?"
          options={visitedOptions}
          required
          {...bind("visited")}
        />

        <FormField
          as="textarea"
          label="Do you need any support or adjustments? (optional)"
          rows={4}
          hint="For example: step-free access, a sign language interpreter or large-print letters."
          {...bind("supportNeeds")}
        />
      </FormSection>

      <button className="btn-primary" type="submit" aria-disabled={submitting}>
        {submitting ? "Sending your booking…" : "Confirm booking"}
      </button>
    </form>
  );
}

export default BookingForm;
