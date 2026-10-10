// Mock backend. Replace the bodies of getSlots() and bookSlot() with fetch()
// calls to the Google Apps Script later; nothing else in the app changes.
const DELAY_MS = 700;
const DAYS_AHEAD = 14;
const TIMES = [
  "08:30",
  "09:15",
  "10:00",
  "11:30",
  "13:00",
  "14:15",
  "15:30",
  "16:45",
];

const booked = new Set(); // slot ids booked during this session

const pad = (n) => String(n).padStart(2, "0");
const toDateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Small deterministic hash: availability looks varied but is stable
function hash(text) {
  let h = 0;
  for (const char of text) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

function buildSlots(practitionerId) {
  const slots = [];
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);

    const weekday = day.getDay();
    if (weekday === 0 || weekday === 6) continue; // closed at weekends

    const date = toDateKey(day);
    for (const time of TIMES) {
      const start = `${date}T${time}`;
      const id = `${practitionerId}|${start}`;

      if (new Date(start) <= now) continue; // already past
      if (hash(id) % 3 === 0) continue; // taken by someone else
      if (booked.has(id)) continue; // booked in this session

      slots.push({ id, practitionerId, date, time, start });
    }
  }
  return slots;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSlots(practitionerId = "any") {
  await wait(DELAY_MS);
  return buildSlots(practitionerId);
}

export async function bookSlot(start, booking) {
  await wait(DELAY_MS);

  const practitionerId = booking.practitionerId ?? "any";
  const id = `${practitionerId}|${start}`;
  const stillOpen = buildSlots(practitionerId).some((slot) => slot.id === id);

  if (!stillOpen) {
    throw Object.assign(new Error("That time is no longer available."), {
      code: "SLOT_TAKEN",
    });
  }

  booked.add(id);
  return { id };
}
