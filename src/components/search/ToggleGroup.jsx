import { useId } from "react";
import styles from "./ToggleGroup.module.css";
import ToggleButton from "../ui/ToggleButton";

// A labelled group of independent toggle buttons.
// options: [{ value, label }], values: array of the pressed values.
function ToggleGroup({ legend, hint, options, values, onToggle }) {
  const hintId = useId();

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

      <div className={styles["chips"]}>
        {options.map(({ value, label }) => (
          <ToggleButton
            key={value}
            pressed={values.includes(value)}
            onClick={() => onToggle(value)}
          >
            {label}
          </ToggleButton>
        ))}
      </div>
    </fieldset>
  );
}

export default ToggleGroup;
