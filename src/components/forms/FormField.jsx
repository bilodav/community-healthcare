import { useId } from "react";
import styles from "./FormField.module.css";

// Label + control + optional hint, wired together with matching ids.
// `as` can be "input" (default), "select" or "textarea".
function FormField({
  label,
  name,
  as: Control = "input",
  required = false,
  hint,
  children,
  ...rest
}) {
  const id = useId();
  const hintId = `${id}-hint`;

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
        aria-describedby={hint ? hintId : undefined}
        {...rest}
      >
        {children}
      </Control>

      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}
    </div>
  );
}

export default FormField;
