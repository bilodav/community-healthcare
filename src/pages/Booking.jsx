import { useEffect, useId, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import styles from "./Booking.module.css";
import BookingForm from "../components/booking/BookingForm";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import { LiveRegions, useAnnouncer } from "../components/forms/LiveRegions";
import { practitioners } from "../data/practitioners";
import { useSlots } from "../hooks/useSlots";
import { bookSlot } from "../services/bookingService";

// Shown when /booking is opened without a valid ?practitioner=
function ChoosePractitioner() {
  return (
    <main id="main" tabIndex={-1} className={styles["booking"]}>
      <title>Choose a practitioner – Community Clinic</title>

      <div className="container">
        <h1>Choose a practitioner first</h1>
        <p className="lead">
          Appointments are booked with a specific practitioner. Find the right
          person, then pick a date and time that suits you.
        </p>
        <Link className="btn-primary" to="/listing">
          Find a practitioner
        </Link>
      </div>
    </main>
  );
}

function BookingFlow({ practitioner }) {
  const { polite, assertive, announce, clear } = useAnnouncer();
  const [phase, setPhase] = useState("editing"); // "editing" | "submitting" | "confirmed"
  const [booking, setBooking] = useState(null);
  const [resetCount, setResetCount] = useState(0);
  const headingRef = useRef(null);
  const titleId = useId();

  const { slots, status, reload } = useSlots(practitioner.id);

  const handleSubmit = async (values) => {
    setPhase("submitting");
    announce("Sending your booking. Please wait.");

    try {
      await bookSlot(values.slot, {
        ...values,
        practitionerId: practitioner.id,
      });
      setBooking(values);
      setPhase("confirmed");
      clear(); // the confirmation heading takes focus, so no second announcement
    } catch (error) {
      setPhase("editing");
      reload(); // refresh the list so the taken time disappears
      announce(
        error.code === "SLOT_TAKEN"
          ? "Sorry, that time was just taken. Please choose another time."
          : "We couldn't save your booking. Please try again.",
        "assertive",
      );
    }
  };

  const handleInvalid = (count) => {
    announce(
      `Your booking was not submitted. ${count} ${
        count === 1 ? "field needs" : "fields need"
      } attention.`,
      "assertive",
    );
  };

  const handleReset = () => {
    setBooking(null);
    setPhase("editing");
    setResetCount((n) => n + 1);
    reload(); // the time just booked should no longer be offered
  };

  // The confirmation view unmounts on reset, which would drop focus to <body>.
  // Put it back on the page heading instead.
  useEffect(() => {
    if (resetCount > 0) headingRef.current?.focus();
  }, [resetCount]);

  const confirmed = phase === "confirmed";

  return (
    <main id="main" tabIndex={-1} className={styles["booking"]}>
      <title>
        {confirmed
          ? "Booking confirmed – Community Clinic"
          : `Book with ${practitioner.name} – Community Clinic`}
      </title>

      <div className="container">
        <h1 id={titleId} ref={headingRef} tabIndex={-1}>
          Book an appointment
        </h1>

        {/* Always mounted, so screen readers register the regions up front */}
        <LiveRegions polite={polite} assertive={assertive} />

        {confirmed ? (
          <BookingConfirmation
            booking={booking}
            slot={booking.slot}
            practitionerName={practitioner.name}
            onReset={handleReset}
          />
        ) : (
          <>
            <p className="lead">
              Booking with <strong>{practitioner.name}</strong> (
              {practitioner.role}).{" "}
              <Link to="/listing">Choose a different practitioner</Link>
            </p>

            <p>
              Fields marked <span className="required">(required)</span> must be
              completed.
            </p>

            <BookingForm
              key={resetCount}
              labelledBy={titleId}
              submitting={phase === "submitting"}
              slots={slots}
              slotsStatus={status}
              onRetrySlots={reload}
              onSubmit={handleSubmit}
              onInvalid={handleInvalid}
            />
          </>
        )}
      </div>
    </main>
  );
}

function Booking() {
  const [searchParams] = useSearchParams();
  const practitioner = practitioners.find(
    (p) => p.id === searchParams.get("practitioner"),
  );

  if (!practitioner) return <ChoosePractitioner />;

  // key: if the ?practitioner= value changes, start the flow fresh
  return <BookingFlow key={practitioner.id} practitioner={practitioner} />;
}

export default Booking;
