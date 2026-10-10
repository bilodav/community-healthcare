export function formatSlot(datetime) {
  const date = new Date(datetime);
  if (Number.isNaN(date.getTime())) return datetime;

  const day = date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} at ${time}`;
}

export function formatDay(dateKey) {
  const date = new Date(`${dateKey}T00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;

  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
