import { useEffect, useId, useRef } from "react";
import { Link } from "react-router";
import styles from "./BookingConfirmation.module.css";
import { appointmentTypes, visitedOptions } from "../../data/bookingOptions";
import { formatSlot } from "../../utils/formatSlot";

const labelFor = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value;

function BookingConfirmation({ booking, slot, practitionerName, onReset }) {
  const headingId = useId();
  const headingRef = useRef(null);

  // This component only mounts once the booking is confirmed, so focusing
  // on mount is exactly "move focus to the new view's heading".
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={styles["confirmation"]} aria-labelledby={headingId}>
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        Booking confirmed
      </h2>
      <p>
        Thank you, {booking.firstName}. We will send your confirmation to{" "}
        <strong>{booking.email}</strong> and a reminder to{" "}
        <strong>{booking.contactNumber}</strong>.
      </p>

      <dl className={styles["details"]}>
        <div>
          <dt>Appointment time</dt>
          <dd>
            <time dateTime={slot}>{formatSlot(slot)}</time>
          </dd>
        </div>
        {practitionerName && (
          <div>
            <dt>Practitioner</dt>
            <dd>{practitionerName}</dd>
          </div>
        )}
        <div>
          <dt>Name</dt>
          <dd>
            {booking.firstName} {booking.lastName}
          </dd>
        </div>
        <div>
          <dt>Type of appointment</dt>
          <dd>{labelFor(appointmentTypes, booking.appointment)}</dd>
        </div>
        <div>
          <dt>Visited before</dt>
          <dd>{labelFor(visitedOptions, booking.visited)}</dd>
        </div>
        <div>
          <dt>Support or adjustments</dt>
          <dd>{booking.supportNeeds.trim() || "None requested"}</dd>
        </div>
      </dl>

      <div className={styles["actions"]}>
        <button type="button" className="btn-outline" onClick={onReset}>
          Book another appointment
        </button>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default BookingConfirmation;
