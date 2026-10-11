import styles from "./Triage.module.css";
import { Link } from "react-router";
import { useId } from "react";
import { listingUrl } from "../../utils/filterParams";

// Each option carries the listing filters it should open with.
// Placeholder logic for the prototype: a real clinic's staff should confirm
// which practitioners suit which situation.
const defaultOptions = [
  {
    id: "routine",
    label: "Routine check-up",
    filters: { profession: ["doctor", "nurse"] },
  },
  {
    id: "follow-up",
    label: "Follow-up appointment",
    filters: { profession: ["doctor", "nurse"], availability: "fortnight" },
  },
  {
    id: "new-symptoms",
    label: "New symptoms",
    filters: { profession: ["doctor", "nurse"], availability: "week" },
  },
  {
    id: "prescription",
    label: "Repeat prescription",
    filters: { profession: ["pharmacist", "doctor"] },
  },
  {
    id: "test-results",
    label: "Test results",
    filters: { profession: ["doctor", "nurse"], consult: ["virtual"] },
  },
];

function Triage({
  title = "Not sure where to start?",
  description = "Choose what best describes your situation. We will show you the right services.",
  options = defaultOptions,
  listingPath = "/listing",
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
          {options.map(({ id, label, filters }) => (
            <li key={id}>
              {/* The pill styling lives on the link, so the whole pill is the
                  click target and the focus ring wraps all of it */}
              <Link className="badge" to={listingUrl(listingPath, filters)}>
                {label}
              </Link>
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
