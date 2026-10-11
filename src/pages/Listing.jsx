import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import styles from "./Listing.module.css";
import SearchForm from "../components/search/SearchForm";
import ResultsList from "../components/results/ResultsList";
import HelpAside from "../components/help/HelpAside";
import { practitioners } from "../data/practitioners";
import { emptyFilters } from "../data/filterOptions";
import { filterPractitioners } from "../utils/filterPractitioners";
import { withAvailability } from "../utils/availability";
import { paramsToFilters, filtersToParams } from "../utils/filterParams";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => paramsToFilters(searchParams));
  const resultsHeadingRef = useRef(null);

  // Availability is derived from the live slot data, then filtered
  const results = filterPractitioners(
    practitioners.map(withAvailability),
    filters,
  );

  const update = (name, value) => setFilters((f) => ({ ...f, [name]: value }));

  const toggle = (name, value) =>
    setFilters((f) => ({
      ...f,
      [name]: f[name].includes(value)
        ? f[name].filter((x) => x !== value)
        : [...f[name], value],
    }));

  const clear = () => setFilters(emptyFilters);

  // Keep the URL in step once the filters settle. State is the source of
  // truth; `replace` stops every keystroke becoming a history entry.
  const settled = useDebouncedValue(filters, 400);
  useEffect(() => {
    const next = filtersToParams(settled);
    const current = filtersToParams(paramsToFilters(searchParams));
    if (next.toString() !== current.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [settled, searchParams, setSearchParams]);

  return (
    <main id="main" tabIndex={-1} className={styles["listing"]}>
      <title>Find a practitioner – Community Clinic</title>
      <meta
        name="description"
        content="Search clinic practitioners by name or profession. Filter by availability, in-person or virtual consultations, and languages spoken."
      />

      <div className={`container ${styles["inner"]}`}>
        <h1>Find a practitioner</h1>
        <p className="lead">
          Search by name or profession, then narrow the results by availability,
          type of consultation and the languages spoken.
        </p>

        <SearchForm
          values={filters}
          onChange={update}
          onToggle={toggle}
          onClear={clear}
          onSubmit={() => resultsHeadingRef.current?.focus()}
        />

        <div className={styles["results-layout"]}>
          <ResultsList practitioners={results} headingRef={resultsHeadingRef} />
          <HelpAside />
        </div>
      </div>
    </main>
  );
}

export default Listing;
