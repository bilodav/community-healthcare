const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// South African cellphone: 06x, 07x or 08x, or the same with +27 / 27 in place of the leading 0
const SA_CELL = /^(?:\+27|27|0)[6-8]\d{8}$/;

// Each rule returns an error message, or "" when the value is fine.
// Messages say what is wrong AND how to fix it (WCAG 3.3.1 and 3.3.3).
// Don't start them with "Error:", because FormField adds that prefix.
const rules = {
  date: (v) => (v ? "" : "Select a date for your appointment."),

  // The time options only appear once a date is chosen, so don't
  // demand a time the person can't see yet
  slot: (v, all) => {
    if (v || !all.date) return "";
    return "Select a time for your appointment.";
  },

  firstName: (v) => (v.trim() ? "" : "Enter your first name."),

  lastName: (v) => (v.trim() ? "" : "Enter your last name."),

  contactNumber: (v) => {
    const digits = v.replace(/[\s()-]/g, "");
    if (!digits) {
      return "Enter your cellphone number, for example 082 123 4567.";
    }
    return SA_CELL.test(digits)
      ? ""
      : "Enter a South African cellphone number, like 082 123 4567 or +27 82 123 4567.";
  },

  email: (v) => {
    const email = v.trim();
    if (!email) {
      return "Enter your email address, for example name@example.org.";
    }
    return EMAIL.test(email)
      ? ""
      : "Enter an email address in the format name@example.org.";
  },

  appointment: (v) => (v ? "" : "Select a type of appointment from the list."),

  visited: (v) =>
    v ? "" : "Select yes or no: have you visited this practice before?",
};

export function validateField(name, value, values = {}) {
  return rules[name]?.(value, values) ?? "";
}

// Returns an object with only the fields that have errors
export function validateAll(values) {
  const errors = {};
  Object.keys(rules).forEach((name) => {
    const message = validateField(name, values[name], values);
    if (message) errors[name] = message;
  });
  return errors;
}

// Field names in on-screen order (matches the order of the rules above)
export const validatedFields = Object.keys(rules);
