import { useId } from "react";
import styles from "./HelpAside.module.css";

function HelpAside({
  title = "Need help choosing?",
  phone = "0800 000 000",
  email = "bookings@example.org",
}) {
  const titleId = useId();

  return (
    <aside className={styles["notice"]} aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <p>
        Not sure which practitioner you need? Our reception team can point you
        to the right person and book for you.
      </p>
      <ul>
        <li>
          Phone: <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
        </li>
        <li>
          Email: <a href={`mailto:${email}`}>{email}</a>
        </li>
      </ul>
      <p>
        Virtual consultations use video or phone. Tell us if you need a sign
        language interpreter or other support.
      </p>
    </aside>
  );
}

export default HelpAside;
