export const professionOptions = [
  { value: "dentist", label: "Dentist" },
  { value: "dietician", label: "Dietician" },
  { value: "doctor", label: "General practitioner" },
  { value: "gynaecologist", label: "Gynaecologist" },
  { value: "mens-health", label: "Men's health doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "ophthalmologist", label: "Ophthalmologist" },
  { value: "optometrist", label: "Optometrist" },
  { value: "paediatrician", label: "Paediatrician" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "psychologist", label: "Psychologist" },
];

export const availabilityOptions = [
  { value: "any", label: "Any time" },
  { value: "today", label: "Available today" },
  { value: "week", label: "Available this week" },
  { value: "fortnight", label: "Available in the next 14 days" },
];

export const consultOptions = [
  { value: "in-person", label: "In person" },
  { value: "virtual", label: "Virtual (video or phone)" },
];

export const languageOptions = [
  { value: "english", label: "English" },
  { value: "afrikaans", label: "Afrikaans" },
  { value: "isizulu", label: "isiZulu" },
  { value: "isixhosa", label: "isiXhosa" },
  { value: "sesotho", label: "Sesotho" },
  { value: "setswana", label: "Setswana" },
  { value: "sasl", label: "South African Sign Language" },
];

export const emptyFilters = {
  q: "",
  profession: [],
  availability: "any",
  consult: [],
  language: [],
};

export const getLanguageLabel = (value) =>
  languageOptions.find((o) => o.value === value)?.label ?? value;
