# Primary Assistive Technology User Persona

**Project:** Community Healthcare Clinic: Accessible Healthcare Booking Portal · **Ticket:** MD-2026-0143
**Persona type:** Non-visual screen reader user (keyboard only)

> A fictional composite based on patterns in the WebAIM Screen Reader User Survey. It is a design tool, not a real person.

---

## 1. Profile

**Priya Nair, 47.** Part-time telephone support officer who works from home three days a week and lives with her teenage daughter. She has been blind since 33 (diabetic retinopathy) and has no light perception. She has type 2 diabetes and high blood pressure, so she books recurring appointments: eye clinic follow-ups, foot checks, GP reviews and repeat prescriptions. She is confident with her tools but regularly blocked by badly built websites.

> _"I'm not asking for anything special. I'm asking for the page to say what's actually on it."_

---

## 2. Technical configuration

| Category           | Details                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Devices**        | Windows 11 laptop. iPhone for appointment reminders.                                        |
| **Screen readers** | NVDA (latest) at about three times conversational speed. JAWS at work. VoiceOver on iPhone. |
| **Browsers**       | Firefox (best NVDA pairing), Chrome as a backup.                                            |
| **Braille**        | 14-cell refreshable display, used to check dates, times and reference numbers.              |
| **Input modality** | Keyboard only. No mouse or touchscreen on the laptop.                                       |
| **Other settings** | Screen curtain on. High-contrast mode for family members who share the machine.             |

**How she navigates:** she jumps between landmarks (`D`), headings (`H`) and form fields (`F`), checks the Elements List (`NVDA+F7`) to see whether a page makes sense, and relies on a field's label, role, state and description being read together. She expects `main` to be the first landmark she reaches. A broken heading outline means a lost user.

---

## 3. Primary goals

1. **Book an appointment independently**, without phoning the clinic or asking her daughter for help.
2. **Find the right service** using search and filters, without wading through unlabelled links.
3. **Know at once whether an action worked**: that results updated, what the date and time are, and that the booking went through.
4. **Finish in under five minutes**, because her careful navigation makes session timeouts a real risk.

---

## 4. Pain points with conventional web design

- **Unlabelled fields and buttons.** NVDA says "edit, blank" and she has to guess what to type.
- **Errors shown only visually.** The field turns red, nothing is announced, and she assumes the site is broken.
- **Inaccessible date pickers.** Calendar grids she cannot reach by keyboard push her back to the phone.
- **Lost focus after changes.** Results update or a dialog opens, but focus stays behind and she does not know anything happened.
- **Keyboard traps.** She tabs into a widget and can only leave by refreshing and losing her form.
- **Silent or over-chatty live regions.** Either nothing is announced when search results change, or announcements interrupt her and repeat on every keystroke.
- **Vague links** such as repeated "Read more", and **status shown only by colour**, such as green and red slots.
- **Skipped heading levels and missing landmarks**, so she cannot get an overview and must read top to bottom.

---

## 5. Scenario: booking a diabetic eye screening

Priya has a reminder that her annual eye screening is due. She opens the site in Firefox, presses `D` to reach `main`, and searches for her practitioner. She hears one result count after she stops typing, picks a practitioner, and chooses a date and time. When she mistypes her phone number, focus moves to an error summary that lists the problem and links to the field. After she fixes it, the booking confirmation takes focus and she reads the date and time on her braille display.

**Success measure:** she books independently, in one pass, in under five minutes, with no phone call.
