import { useId, useState } from "react";
import { useSearchParams } from "react-router";
import styles from "./Booking.module.css";
import SelectedSlot from "../components/booking/SelectedSlot";
import BookingForm from "../components/booking/BookingForm";
import { practitioners } from "../data/practitioners";

const DEFAULT_SLOT = "2026-10-09T10:15"; // placeholder until the listing page passes a real slot

function Booking() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const titleId = useId();

  const slot = searchParams.get("slot") ?? DEFAULT_SLOT;
  const practitioner = practitioners.find(
    (p) => p.id === searchParams.get("practitioner"),
  );

  const handleSubmit = (booking) => {
    // Later: send to your API, or navigate to a review page
    console.log("Booking details", booking);
    setStatus("Your details have been saved. Please review your booking.");
  };

  return (
    <main id="main" tabIndex={-1} className={styles["booking"]}>
      <title>Book an appointment – Community Clinic</title>

      <div className="container">
        <h1 id={titleId}>Book an appointment</h1>

        <SelectedSlot datetime={slot} practitionerName={practitioner?.name} />

        <p>
          Fields marked <span className="required">(required)</span> must be
          completed.
        </p>

        {/* Live region: always rendered, text changes after submit */}
        <div role="status">{status}</div>

        <BookingForm labelledBy={titleId} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}

export default Booking;
