const availabilityRank = { today: 0, week: 1, fortnight: 2, later: 3 };
const maxRank = { any: Infinity, today: 0, week: 1, fortnight: 2 };

export function filterPractitioners(list, filters) {
  const { q, profession, availability, consult, language } = filters;
  const term = q.trim().toLowerCase();

  return list.filter((p) => {
    if (term && !`${p.name} ${p.role}`.toLowerCase().includes(term))
      return false;
    if (profession && p.profession !== profession) return false;
    if (availabilityRank[p.availability] > (maxRank[availability] ?? Infinity))
      return false;
    if (consult.length && !consult.some((c) => p.consultations.includes(c)))
      return false;
    if (language.length && !language.some((l) => p.languages.includes(l)))
      return false;
    return true;
  });
}
