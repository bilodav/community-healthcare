import styles from "./HowItWorks.module.css";
import { useId } from "react";

const defaultSteps = [
  {
    title: "Find a service",
    description: "Search or filter the clinic directory.",
  },
  {
    title: "Choose a time",
    description: "See which practitioners are free and pick a slot.",
  },
  {
    title: "Confirm your details",
    description:
      "Review everything before you confirm. You can go back and change it.",
  },
];

function HowItWorks({
  title = "How booking works",
  subtitle = "From feeling unwell to visiting our facility",
  steps = defaultSteps,
}) {
  const titleId = useId();

  return (
    <section className="section" aria-labelledby={titleId}>
      <div className={`container ${styles["how-to"]}`}>
        <h2 id={titleId} className={styles["title"]}>
          {title}
        </h2>
        <p className={styles["subtitle"]}>{subtitle}</p>

        <ol className={styles["steps"]}>
          {steps.map(({ title, description }, index) => (
            <li key={title} className={styles["info-block"]}>
              <span className={styles["number"]} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
