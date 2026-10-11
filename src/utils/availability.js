import { getNextSlot } from "../services/bookingService";
import { formatDay } from "./formatSlot";

function daysUntil(dateKey) {
  const slotDay = new Date(`${dateKey}T00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((slotDay - today) / 86_400_000);
}

// Adds `availability` (used by the filter) and `nextAvailable` (shown on the
// card) from the same slots the booking page offers.
export function withAvailability(practitioner) {
  const next = getNextSlot(practitioner.id);

  if (!next) {
    return {
      ...practitioner,
      availability: "later",
      nextAvailable:
        "No appointments in the next two weeks. Please phone reception.",
    };
  }

  const days = daysUntil(next.date);
  const when = `${formatDay(next.date)}, ${next.time}`;

  if (days === 0) {
    return {
      ...practitioner,
      availability: "today",
      nextAvailable: `Available today, ${next.time}`,
    };
  }
  if (days <= 6) {
    return {
      ...practitioner,
      availability: "week",
      nextAvailable: `Available this week: ${when}`,
    };
  }
  return {
    ...practitioner,
    availability: "fortnight",
    nextAvailable: `Available in the next 14 days: ${when}`,
  };
}
