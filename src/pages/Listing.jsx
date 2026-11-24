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

function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlKey = searchParams.toString();
  const [filters, setFilters] = useState(() => paramsToFilters(searchParams));

  // The query string the controls currently agree with: either what we read
  // from the URL or what we last wrote to it.
  const [syncedKey, setSyncedKey] = useState(urlKey);

  // URL -> controls. If the URL changed to something we did not write
  // (Back/Forward, a link to /listing?profession=doctor while already on the
  // page), rebuild the controls from it. Done during render, so there is no
  // frame with stale controls.
  if (urlKey !== syncedKey) {
    setSyncedKey(urlKey);
    setFilters(paramsToFilters(searchParams));
  }

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

  // Mirror the controls into the URL once the visitor stops changing them, so
  // a filtered view can be shared. `replace` stops every keystroke becoming a
  // history entry. The timer is cancelled whenever the filters or the URL
  // change, so a write that is still waiting can never overwrite a newer
  // navigation with stale filters.

  useEffect(() => {
    const next = filtersToParams(filters).toString();
    if (next === syncedKey) return;

    const timer = setTimeout(() => {
      setSyncedKey(next);
      setSearchParams(new URLSearchParams(next), { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, syncedKey, setSearchParams]);

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
