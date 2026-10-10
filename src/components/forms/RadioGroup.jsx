import { useId } from "react";
import FormSection from "./FormSection";

// Nested fieldset + legend, so the question is announced before each option.
// Supports the same hint and error pattern as FormField.
function RadioGroup({
  legend,
  name,
  id: idProp,
  options,
  value,
  onChange,
  required = false,
  hint,
  error,
}) {
  const generatedId = useId();
  const baseId = idProp ?? generatedId;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;

  const describedBy = [hint && hintId, error && errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <FormSection
      legend={
        <>
          {legend}
          {required && (
            <>
              {" "}
              <span className="required">(required)</span>
            </>
          )}
        </>
      }
      small
      role="radiogroup"
      aria-required={required || undefined}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={describedBy || undefined}
    >
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

      {options.map((option, index) => {
        // The first radio takes the group's id, so an error summary link
        // has a real focusable element to jump to
        const inputId = index === 0 ? baseId : `${baseId}-${option.value}`;
        return (
          <div className="field-inline" key={option.value}>
            <input
              type="radio"
              id={inputId}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
            />
            <label htmlFor={inputId}>{option.label}</label>
          </div>
        );
      })}
    </FormSection>
  );
}

export default RadioGroup;
