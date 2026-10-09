import styles from "./Triage.module.css";
import { Link } from "react-router";
import { useId } from "react";

const defaultOptions = [
  { label: "Routine check-up", urgency: "routine" },
  { label: "Follow-up appointment", urgency: "follow-up" },
  { label: "New symptoms", urgency: "new-symptoms" },
  { label: "Repeat prescription", urgency: "prescription" },
  { label: "Test results", urgency: "test-results" },
];

function Triage({
  title = "Not sure where to start?",
  description = "Choose what best describes your situation. We will show you the right services.",
  options = defaultOptions,
  basePath = "/listing",
  emergencyNote = "If this is an emergency, call 10111 straight away.",
}) {
  const titleId = useId();

  return (
    <section
      className={`section ${styles["triage"]}`}
      aria-labelledby={titleId}
    >
      <div className="container">
        <h2 id={titleId} className={styles["title"]}>
          {title}
        </h2>
        <p className={styles["description"]}>{description}</p>

        <ul className={styles["pill-list"]}>
          {options.map(({ label, urgency }) => (
            <li key={urgency} className="badge">
              <Link to={`${basePath}?urgency=${urgency}`}>{label}</Link>
            </li>
          ))}
        </ul>

        {emergencyNote && (
          <p className={styles["emergency"]}>{emergencyNote}</p>
        )}
      </div>
    </section>
  );
}

export default Triage;
