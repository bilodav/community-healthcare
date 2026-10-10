function formatSlot(datetime) {
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

function SelectedSlot({ datetime, practitionerName }) {
  return (
    <p className="lead">
      Your selected time:{" "}
      <strong>
        <time dateTime={datetime}>{formatSlot(datetime)}</time>
      </strong>
      {practitionerName && <> with {practitionerName}</>}
    </p>
  );
}

export default SelectedSlot;
