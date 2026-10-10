import { useState } from "react";
import styles from "./BookingForm.module.css";
import FormSection from "../forms/FormSection";
import FormField from "../forms/FormField";
import RadioGroup from "../forms/RadioGroup";
import {
  appointmentTypes,
  visitedOptions,
  emptyBooking,
} from "../../data/bookingOptions";

function BookingForm({ labelledBy, onSubmit }) {
  const [values, setValues] = useState(emptyBooking);

  // One handler for every field, keyed by the input's name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  // Only runs when native validation (required, type=email) passes
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form
      className={styles["form"]}
      onSubmit={handleSubmit}
      aria-labelledby={labelledBy}
    >
      <FormSection legend="Your details">
        <FormField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          required
          value={values.firstName}
          onChange={handleChange}
        />

        <FormField
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          required
          value={values.lastName}
          onChange={handleChange}
        />

        <FormField
          label="Cellphone number"
          name="contactNumber"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          hint="We will send your reminder here. For example: 082 123 4567."
          required
          value={values.contactNumber}
          onChange={handleChange}
        />

        <FormField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          hint="We will send your booking confirmation here."
          required
          value={values.email}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection legend="Appointment details">
        <FormField
          as="select"
          label="Type of appointment"
          name="appointment"
          required
          value={values.appointment}
          onChange={handleChange}
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
          name="visited"
          options={visitedOptions}
          value={values.visited}
          onChange={handleChange}
          required
        />

        <FormField
          as="textarea"
          label="Do you need any support or adjustments? (optional)"
          name="supportNeeds"
          rows={4}
          hint="For example: step-free access, a sign language interpreter or large-print letters."
          value={values.supportNeeds}
          onChange={handleChange}
        />
      </FormSection>

      <button className="btn-primary" type="submit">
        Review your booking
      </button>
    </form>
  );
}

export default BookingForm;
