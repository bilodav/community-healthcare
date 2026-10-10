import { useId } from "react";
import { Link } from "react-router";
import styles from "./PractitionerCard.module.css";
import { getLanguageLabel } from "../../data/filterOptions";

function consultationText(consultations) {
  if (
    consultations.includes("in-person") &&
    consultations.includes("virtual")
  ) {
    return "In person and virtual";
  }
  return consultations.includes("virtual") ? "Virtual only" : "In person only";
}

function PractitionerCard({ practitioner, bookingPath = "/booking" }) {
  const headingId = useId();
  const { id, name, role, consultations, languages, nextAvailable } =
    practitioner;

  return (
    <article className={`card ${styles["card"]}`} aria-labelledby={headingId}>
      <h3 id={headingId}>{name}</h3>
      <p className={styles["profession"]}>{role}</p>

      <dl className={styles["details"]}>
        <div>
          <dt>Consultations</dt>
          <dd>{consultationText(consultations)}</dd>
        </div>
        <div>
          <dt>Languages</dt>
          <dd>{languages.map((l) => getLanguageLabel(l)).join(", ")}</dd>
        </div>
        <div>
          <dt>Next available</dt>
          <dd className={styles["status"]}>{nextAvailable}</dd>
        </div>
      </dl>

      <Link
        className={`btn-outline ${styles["action"]}`}
        to={`${bookingPath}?practitioner=${id}`}
      >
        Book with {name}
      </Link>
    </article>
  );
}

export default PractitionerCard;
