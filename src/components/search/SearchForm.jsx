import { useId, useState } from "react";
import styles from "./SearchForm.module.css";
import FilterPanel from "./FilterPanel";
import { emptyFilters, professionOptions } from "../../data/filterOptions";
import Button from "../ui/Button";

function SearchForm({ initialValues, onSearch, onClear }) {
  const [values, setValues] = useState(initialValues);
  const id = useId();
  const titleId = `${id}-title`;
  const searchId = `${id}-search`;
  const hintId = `${id}-search-hint`;
  const professionId = `${id}-profession`;

  const update = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const toggle = (name, value) =>
    setValues((v) => ({
      ...v,
      [name]: v[name].includes(value)
        ? v[name].filter((x) => x !== value)
        : [...v[name], value],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(values);
  };

  const handleClear = () => {
    setValues(emptyFilters);
    onClear();
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
            onChange={(e) => update("q", e.target.value)}
          />
          <span id={hintId} className="field-hint">
            For example: "Mokoena" or "diabetes".
          </span>
        </div>

        <div className="field">
          <label htmlFor={professionId}>Profession</label>
          <select
            id={professionId}
            name="profession"
            value={values.profession}
            onChange={(e) => update("profession", e.target.value)}
          >
            <option value="">All professions</option>
            {professionOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FilterPanel values={values} onChange={update} onToggle={toggle} />

      <div className={styles["form-actions"]}>
        <Button text="Search Practitioners" type="submit" />
        <Button
          text="Clear all filters"
          type="button"
          onClick={() => handleClear()}
        />
      </div>
    </form>
  );
}

export default SearchForm;
