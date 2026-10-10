import { useId } from "react";
import styles from "./ResultsList.module.css";
import PractitionerCard from "./PractitionerCard";

function ResultsList({ practitioners, title = "Available practitioners" }) {
  const titleId = useId();
  const count = practitioners.length;

  return (
    <section id="availability" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>

      {/* Live region: exists on load, text changes when results change */}
      <p className={styles["results-count"]} role="status">
        {`${count} practitioner${count === 1 ? "" : "s"} found`}
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
