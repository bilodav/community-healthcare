import { useId } from "react";
import styles from "./ResultsList.module.css";
import PractitionerCard from "./PractitionerCard";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const countText = (n) => `${n} practitioner${n === 1 ? "" : "s"} found`;

function ResultsList({
  practitioners,
  headingRef,
  title = "Available practitioners",
}) {
  const titleId = useId();
  const count = practitioners.length;

  // The spoken count waits until changes stop, so typing "mokoena" doesn't
  // queue seven announcements
  const announcedCount = useDebouncedValue(count, 800);

  return (
    <section id="availability" aria-labelledby={titleId}>
      <h2
        id={titleId}
        ref={headingRef}
        tabIndex={-1}
        className={styles["heading"]}
      >
        {title}
      </h2>

      {/* Visible count: updates instantly. Hidden from assistive tech so it
          isn't read twice alongside the live region below. */}
      <p className={styles["results-count"]} aria-hidden="true">
        {countText(count)}
      </p>

      {/* Spoken count: polite, debounced, always in the DOM */}
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {countText(announcedCount)}
      </p>

      {count > 0 ? (
        <ul className={styles["results-list"]}>
          {practitioners.map((p) => (
            <li key={p.id}>
              <PractitionerCard practitioner={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No practitioners match your search. Try removing some filters.</p>
      )}
    </section>
  );
}

export default ResultsList;
