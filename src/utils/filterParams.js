import { emptyFilters } from "../data/filterOptions";

export function paramsToFilters(params) {
  return {
    q: params.get("q") ?? "",
    profession: params.getAll("profession"),
    availability: params.get("availability") ?? "any",
    consult: params.getAll("consult"),
    language: params.getAll("language"),
  };
}

export function filtersToParams(f) {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q.trim());
  f.profession.forEach((v) => params.append("profession", v));
  if (f.availability !== "any") params.set("availability", f.availability);
  f.consult.forEach((v) => params.append("consult", v));
  f.language.forEach((v) => params.append("language", v));
  return params;
}

// Build a link to the listing from a partial set of filters,
// e.g. listingUrl("/listing", { profession: ["doctor"] })
export function listingUrl(path, filters) {
  const query = filtersToParams({ ...emptyFilters, ...filters }).toString();
  return query ? `${path}?${query}` : path;
}
