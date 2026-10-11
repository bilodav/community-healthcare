import { useId } from "react";
import styles from "./SearchForm.module.css";
import FilterPanel from "./FilterPanel";
import ToggleGroup from "./ToggleGroup";
import { professionOptions } from "../../data/filterOptions";
import Button from "../ui/Button";

// Controlled: the parent owns the filter values and updates them live
function SearchForm({ values, onChange, onToggle, onClear, onSubmit }) {
  const id = useId();
  const titleId = `${id}-title`;
  const searchId = `${id}-search`;
  const hintId = `${id}-search-hint`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      className={styles["search-form"]}
      onSubmit={handleSubmit}
      role="search"
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="sr-only">
        Search and filter practitioners
      </h2>

      <div className={styles["search-row"]}>
        <div className="field">
          <label htmlFor={searchId}>Search by name or keyword</label>
          <input
            type="search"
            id={searchId}
            name="q"
            autoComplete="off"
            aria-describedby={hintId}
            value={values.q}
            onChange={(e) => onChange("q", e.target.value)}
          />
          <span id={hintId} className="field-hint">
            For example: "Mokoena" or "diabetes". Results update automatically
            as you type or change a filter.
          </span>
        </div>
      </div>

      <ToggleGroup
        legend="Profession"
        hint="Select any to narrow the results. Leave all unselected to see every profession."
        options={professionOptions}
        values={values.profession}
        onToggle={(v) => onToggle("profession", v)}
      />

      <FilterPanel values={values} onChange={onChange} onToggle={onToggle} />

      <div className={styles["form-actions"]}>
        <Button text="Show results" type="submit" />
        <Button text="Clear all filters" type="button" onClick={onClear} />
      </div>
    </form>
  );
}

export default SearchForm;
