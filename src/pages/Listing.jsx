import { useSearchParams } from "react-router";
import styles from "./Listing.module.css";
import SearchForm from "../components/search/SearchForm";
import ResultsList from "../components/results/ResultsList";
import HelpAside from "../components/help/HelpAside";
import { practitioners } from "../data/practitioners";
import { filterPractitioners } from "../utils/filterPractitioners";

function paramsToFilters(params) {
  return {
    q: params.get("q") ?? "",
    profession: params.get("profession") ?? "",
    availability: params.get("availability") ?? "any",
    consult: params.getAll("consult"),
    language: params.getAll("language"),
  };
}

function filtersToParams(f) {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q.trim());
  if (f.profession) params.set("profession", f.profession);
  if (f.availability !== "any") params.set("availability", f.availability);
  f.consult.forEach((v) => params.append("consult", v));
  f.language.forEach((v) => params.append("language", v));
  return params;
}

function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = paramsToFilters(searchParams);
  const results = filterPractitioners(practitioners, filters);

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
          key={searchParams.toString()}
          initialValues={filters}
          onSearch={(f) => setSearchParams(filtersToParams(f))}
          onClear={() => setSearchParams({})}
        />

        <div className={styles["results-layout"]}>
          <ResultsList practitioners={results} />
          <HelpAside />
        </div>
      </div>
    </main>
  );
}

export default Listing;
