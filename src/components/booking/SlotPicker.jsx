import FormSection from "../forms/FormSection";
import FormField from "../forms/FormField";
import RadioGroup from "../forms/RadioGroup";
import { formatDay } from "../../utils/formatSlot";

const plural = (n) => `${n} ${n === 1 ? "time" : "times"}`;

// dateProps / slotProps come from BookingForm's bind(), so they carry the
// id, value, error and handlers for each field.
function SlotPicker({
  slots,
  status,
  selectedDate,
  dateProps,
  slotProps,
  onRetry,
}) {
  // Slots arrive in chronological order, so Map keeps the days in order too
  const byDate = new Map();
  slots.forEach((slot) => {
    if (!byDate.has(slot.date)) byDate.set(slot.date, []);
    byDate.get(slot.date).push(slot);
  });

  const dates = [...byDate.keys()];
  const times = byDate.get(selectedDate) ?? [];

  return (
    <FormSection
      legend="Choose a date and time"
      aria-busy={status === "loading"}
    >
      {status === "loading" && <p>Loading available appointments…</p>}

      {status === "error" && (
        <>
          <p>
            We couldn't load the available appointments. Check your connection
            and try again.
          </p>
          <button type="button" className="btn-outline" onClick={onRetry}>
            Try again
          </button>
        </>
      )}

      {status === "ready" && dates.length === 0 && (
        <p>
          There are no appointments available in the next two weeks. Please
          phone reception and we will find a time for you.
        </p>
      )}

      {status === "ready" && dates.length > 0 && (
        <>
          <FormField
            as="select"
            label="Date"
            required
            hint="We are open Monday to Friday. Showing the next two weeks."
            {...dateProps}
          >
            <option value="">Select a date</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDay(date)} ({plural(byDate.get(date).length)})
              </option>
            ))}
          </FormField>

          {selectedDate && times.length > 0 && (
            <RadioGroup
              legend={`Time on ${formatDay(selectedDate)}`}
              required
              hint={`${plural(times.length)} available.`}
              options={times.map((slot) => ({
                value: slot.start,
                label: slot.time,
              }))}
              {...slotProps}
            />
          )}

          {selectedDate && times.length === 0 && (
            <p>No times are left on this day. Please choose another date.</p>
          )}
        </>
      )}
    </FormSection>
  );
}

export default SlotPicker;
