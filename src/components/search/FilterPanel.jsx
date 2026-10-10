import { useId, useState } from "react";
import styles from "./FilterPanel.module.css";
import { RadioFieldset, CheckboxFieldset } from "./FilterFieldsets";
import {
  availabilityOptions,
  consultOptions,
  languageOptions,
} from "../../data/filterOptions";

function FilterPanel({ values, onChange, onToggle, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={styles["panel"]}>
      <button
        type="button"
        className={styles["toggle"]}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        Filter results
      </button>

      <div id={panelId} hidden={!open}>
        <div className={styles["groups"]}>
          <RadioFieldset
            legend="Availability"
            name="availability"
            options={availabilityOptions}
            value={values.availability}
            onChange={(v) => onChange("availability", v)}
          />

          <CheckboxFieldset
            legend="Type of consultation"
            hint="Select one or both."
            name="consult"
            options={consultOptions}
            values={values.consult}
            onToggle={(v) => onToggle("consult", v)}
          />

          <CheckboxFieldset
            legend="Languages spoken"
            hint="Select any that apply. Shows practitioners who speak at least one."
            name="language"
            options={languageOptions}
            values={values.language}
            onToggle={(v) => onToggle("language", v)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
