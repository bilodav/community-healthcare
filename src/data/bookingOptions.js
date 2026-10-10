export const appointmentTypes = [
  { value: "consult", label: "Consult without a procedure" },
  { value: "procedure", label: "Consult with a procedure" },
];

export const visitedOptions = [
  { value: "no", label: "No, this is my first visit" },
  { value: "yes", label: "Yes, I have visited before" },
];

export const emptyBooking = {
  date: "",
  slot: "",
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  appointment: "",
  visited: "no",
  supportNeeds: "",
};
