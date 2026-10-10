import { useId } from "react";
import styles from "./FilterFieldsets.module.css";

// One choice only
export function RadioFieldset({ legend, name, options, value, onChange }) {
  const id = useId();

  return (
    <fieldset className={styles["fieldset"]}>
      <legend className={styles["legend"]}>{legend}</legend>
      {options.map((option) => {
        const inputId = `${id}-${option.value}`;
        return (
          <div className="field-inline" key={option.value}>
            <input
              type="radio"
              id={inputId}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <label htmlFor={inputId}>{option.label}</label>
          </div>
        );
      })}
    </fieldset>
  );
}

// Several choices allowed
export function CheckboxFieldset({
  legend,
  hint,
  name,
  options,
  values,
  onToggle,
}) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <fieldset
      className={styles["fieldset"]}
      aria-describedby={hint ? hintId : undefined}
    >
      <legend className={styles["legend"]}>{legend}</legend>
      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}
      {options.map((option) => {
        const inputId = `${id}-${option.value}`;
        return (
          <div className="field-inline" key={option.value}>
            <input
              type="checkbox"
              id={inputId}
              name={name}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <label htmlFor={inputId}>{option.label}</label>
          </div>
        );
      })}
    </fieldset>
  );
}
