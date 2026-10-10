import { useId } from "react";
import styles from "./ErrorSummary.module.css";

// errors: [{ id: "booking-firstName", message: "Enter your first name." }, ...]
// `ref` is a normal prop in React 19, so the parent can focus this element.
function ErrorSummary({ errors, ref, title = "There is a problem" }) {
  const headingId = useId();

  if (errors.length === 0) return null;

  // A plain #hash link jumps to the field but doesn't reliably move focus
  // in every browser and screen reader, so focus it explicitly.
  const focusField = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.focus();
  };

  return (
    <div
      ref={ref}
      className={styles["summary"]}
      tabIndex={-1}
      role="group"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles["title"]}>
        {title}
      </h2>
      <ul className={styles["list"]}>
        {errors.map(({ id, message }) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => focusField(e, id)}>
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorSummary;
