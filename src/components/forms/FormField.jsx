import { useId } from "react";
import styles from "./FormField.module.css";

// Label + control + optional hint + optional error, wired together with matching ids.
// `as` can be "input" (default), "select" or "textarea".
// Pass `id` when something else (like the error summary) needs to link to the field.
function FormField({
  label,
  name,
  id: idProp,
  as: Control = "input",
  required = false,
  hint,
  error,
  children,
  ...rest
}) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  // Screen readers read every id listed here, in order: hint first, then error
  const describedBy = [hint && hintId, error && errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`field ${styles["field"]}`}>
      <label htmlFor={id}>
        {label}
        {required && (
          <>
            {" "}
            <span className="required">(required)</span>
          </>
        )}
      </label>

      <Control
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        {...rest}
      >
        {children}
      </Control>

      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}

      {error && (
        <span id={errorId} className="field-error-text">
          <span aria-hidden="true">⚠ </span>
          Error: {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
