# Primary Assistive Technology User Persona

**Project:** Community Healthcare Clinic — Accessible Healthcare Booking Portal
**Ticket:** MD-2026-0143
**Persona type:** Non-visual screen reader user (with keyboard-only navigation)

> This persona is a fictional composite, based on common patterns reported in the WebAIM Screen Reader User Survey and established assistive technology usage research. It is a design tool, not a real individual.

---

## 1. Profile

|                        |                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**               | Priya Nair                                                                                                                                                                 |
| **Age**                | 47                                                                                                                                                                         |
| **Occupation**         | Part-time telephone support officer (works from home three days a week)                                                                                                    |
| **Location**           | Suburban area served by the council                                                                                                                                        |
| **Household**          | Lives with her teenage daughter                                                                                                                                            |
| **Disability**         | Blind since age 33 (diabetic retinopathy). No usable vision, no light perception                                                                                           |
| **Health context**     | Type 2 diabetes, high blood pressure. Needs recurring appointments: retinal and eye clinic follow-ups, diabetic foot checks, GP reviews, repeat prescription consultations |
| **Digital confidence** | High. Confident with her tools, but regularly blocked by badly built websites                                                                                              |

> _"I'm not asking for anything special. I'm asking for the page to say what's actually on it."_

---

## 2. Technical Configuration

| Category                    | Details                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Primary device**          | Windows 11 laptop                                                                                                                                                                    |
| **Primary screen reader**   | NVDA (latest stable release), speech rate around 60 to 70 percent of maximum, which is roughly 3x conversational speed                                                               |
| **Secondary screen reader** | JAWS at work (licensed by her employer)                                                                                                                                              |
| **Browser**                 | Firefox (primary, best NVDA pairing), Chrome (secondary)                                                                                                                             |
| **Mobile**                  | iPhone with VoiceOver, used for appointment reminders and confirmation emails                                                                                                        |
| **Braille**                 | 14-cell refreshable braille display (Focus 14 class) for reviewing reference numbers, dates and times                                                                                |
| **Input modality**          | Keyboard only. She does not use a mouse or touchscreen on the laptop. On the iPhone she uses VoiceOver gestures                                                                      |
| **Other settings**          | Screen off most of the time (screen curtain enabled). Browser zoom irrelevant. Operating system set to high contrast for sighted family members and colleagues who share the machine |

### Core navigation habits

- **Browse mode (virtual cursor):** reads and scans page content linearly.
- **Landmark navigation (`D`):** jumps between `header`, `nav`, `main`, `aside`, `footer`. She expects `main` to be the first landmark she reaches.
- **Heading navigation (`H`, `1` to `6`):** her main way of building a mental map of a page. A broken heading outline means a lost user.
- **Form navigation (`F`, `E`, `B`):** jumps between form fields, edit boxes and buttons.
- **Elements List (`NVDA+F7`):** lists all links, headings, form fields and landmarks. She uses it to check whether a page makes sense.
- **Focus mode:** NVDA switches automatically when she tabs into a form field. She relies on the field's label, role, state and description being announced together.
- **Find (`Ctrl+F`):** used to locate things like "Book appointment" on busy pages.

---

## 3. Goals

### Primary goals

1. **Book, change or cancel a clinical appointment independently**, without phoning the clinic and without asking her daughter for help.
2. **Find the right service** (for example "diabetic eye screening") using search and filters, without trawling through dozens of unlabeled links.
3. **Know immediately whether an action worked**: whether her booking was confirmed, what the date and time are, and what the reference number is.

### Secondary goals

- Check practitioner availability before choosing a slot.
- Understand what to bring or prepare, for example fasting before a blood test.
- Keep her health information private, with no need for a sighted person to read it out.
- Complete a booking in under five minutes, because she pays attention to session timeouts.

---

## 4. Pain Points with Conventional Web Design

| #   | Pain point                                       | What she experiences                                                                                                                  |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Unlabeled form fields and buttons**            | NVDA reads "edit, blank" or "button" with no purpose. She has to guess what to type.                                                  |
| 2   | **Errors shown only visually**                   | The page turns a field red but announces nothing. She submits, nothing happens, and she assumes the site is broken.                   |
| 3   | **Inaccessible date pickers**                    | Calendar widgets with unlabeled grid cells that are unreachable by keyboard force her to abandon online booking and phone the clinic. |
| 4   | **Lost focus after dynamic changes**             | A modal opens or results update, but focus stays behind on the page. She is unaware anything has changed.                             |
| 5   | **Keyboard traps**                               | She tabs into a widget or modal and cannot leave without refreshing the page and losing her form data.                                |
| 6   | **Silent loading states**                        | Search results update with no announcement. She cannot tell whether filtering has finished.                                           |
| 7   | **Vague links and buttons**                      | Repeated "Read more" or "Click here" links with no context.                                                                           |
| 8   | **Over-verbose live regions**                    | Announcements that interrupt her mid-sentence, repeat on every keystroke, or read out entire tables.                                  |
| 9   | **Visual-only CAPTCHA**                          | Image-based challenges that block her from booking at all.                                                                            |
| 10  | **Short session timeouts**                       | Slow, careful navigation means her session expires before she finishes a form.                                                        |
| 11  | **Status shown only by colour**                  | "Available" and "Fully booked" slots differentiated only by green and red.                                                            |
| 12  | **Skipped heading levels and missing landmarks** | She cannot get an overview of the page and has to read it top to bottom.                                                              |

---

## 5. Frustration-to-Feature Mapping

This table shows how Priya's needs shape the prototype. It is useful context for the WCAG matrix and for the README.

| Priya's need                            | Design and engineering response                                                                                                     | Related WCAG 2.1 AA |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Know what each field is for             | Explicit `<label htmlFor>` and `aria-describedby` helper text on every input                                                        | 1.3.1, 3.3.2, 4.1.2 |
| Know when something went wrong, and why | `aria-invalid`, plain-language error text linked to the field, an `aria-live` summary, and focus moved to the first error on submit | 3.3.1, 3.3.3, 4.1.3 |
| Know when search results change         | Polite live region announcing the result count ("5 services found"), with `aria-busy` while loading                                 | 4.1.3               |
| Understand filter state                 | `aria-expanded` on accordion headers and `aria-pressed` on toggle filters, kept in sync with React state                            | 4.1.2               |
| Never lose her place                    | Programmatic focus management with `useRef` on route changes, modal open and close, and after filter updates                        | 2.4.3, 3.2.1        |
| Escape any widget                       | No keyboard traps. Modal closes with `Esc` and returns focus to the trigger.                                                        | 2.1.1, 2.1.2        |
| Scan the page quickly                   | Correct landmarks, a single `h1`, a logical heading hierarchy, and a skip link                                                      | 1.3.1, 2.4.1, 2.4.6 |
| Understand availability without colour  | Text labels such as "Available" and "Fully booked" alongside any colour                                                             | 1.4.1               |
| Avoid unclear links                     | Descriptive link text and `aria-label` only where visible text is insufficient                                                      | 2.4.4               |
| Complete forms without timing out       | No hard timeout. Form state preserved during the session.                                                                           | 2.2.1               |

---

## 6. Scenario: Booking a Diabetic Eye Screening

**Context:** Priya received a reminder letter (read to her via her phone's scan-and-read app) saying her annual diabetic eye screening is due. She wants to book it on the clinic website this evening.

1. **Landing:** She opens the site in Firefox. NVDA reads the page title. She presses `D` to jump to the main landmark and `H` to scan the headings. She wants a clear "Find a service" route.
2. **Search:** She tabs to the search field. NVDA announces "Search services, edit". She types "eye screening" and presses `Enter`. She expects to hear a result count such as "3 services found" without hunting for it.
3. **Filtering:** She opens the "Triage and filters" accordion. NVDA announces "Filters, button, expanded". She activates the "Diabetes care" toggle and hears "pressed".
4. **Selecting a service:** She moves to the result list and uses `H` to jump between service names. She activates "Book" on the diabetic eye screening.
5. **Booking form:** Focus moves to the form heading. She completes name, date of birth, preferred practitioner, date and time, and an optional access-needs field. Helper text is read after each label.
6. **Making a mistake:** She enters her date of birth in the wrong format. On submit, focus moves to an error summary announcing "2 problems found", each linking to its field. She fixes them without ever leaving the form.
7. **Confirmation:** A polite announcement reads "Appointment confirmed for Tuesday 14 April at 10:30. Reference MD-48213." Focus lands on the confirmation heading so her braille display shows the details.

**Success measure:** she completes the booking independently, in one pass, in under five minutes, with no assistance and no phone call.

---

## 7. Accessibility Needs Summary

| Needs                             | Doesn't need             |
| --------------------------------- | ------------------------ |
| Semantic structure and landmarks  | Mouse-based interactions |
| Programmatic names, roles, states | Hover-only information   |
| Predictable focus order           | Auto-playing media       |
| Concise, well-timed announcements | Visual-only confirmation |
| Plain language                    | Image-based CAPTCHA      |
| Time to complete tasks            | Drag-and-drop interfaces |

---

## 8. Testing Notes for This Persona

Use this persona as the acceptance test for Part B and Part C:

- **Screen reader pairing:** NVDA with Firefox is the primary test. VoiceOver with Safari is the secondary test.
- **Keyboard only:** unplug the mouse and complete the full booking flow with `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys and `Esc`.
- **Screen off:** run the booking scenario in section 6 with the display turned off. If it cannot be completed, it fails.
- **Announcement audit:** record what NVDA says after each state change. Check that nothing is announced twice, nothing important is silent, and nothing interrupts typing.
