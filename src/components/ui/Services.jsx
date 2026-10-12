import styles from "./Services.module.css";
import { Link } from "react-router";
import { useId } from "react";
import docConsulting from "../../assets/images/docConsulting.jpg";
import { listingUrl } from "../../utils/filterParams";

const defaultServices = [
  {
    id: "general",
    title: "General practice",
    description:
      "Routine appointments, health reviews and referrals with a GP.",
    cta: "Find a general practitioner",
    filters: { profession: ["doctor"] },
  },
  {
    id: "child",
    title: "Child health",
    description: "Check-ups, vaccinations and advice for children.",
    cta: "Find child health care",
    filters: { q: "child" },
  },
  {
    id: "diabetes",
    title: "Diabetes care",
    description: "Annual reviews, foot checks and diabetic eye screening.",
    cta: "Find diabetes care",
    image: docConsulting,
    filters: { q: "diabetes" },
  },
  {
    id: "eye",
    title: "Eye health",
    description: "Vision tests and retinal screening with our eye clinic team.",
    cta: "Find eye health care",
    filters: { profession: ["ophthalmologist", "optometrist"] },
  },
  {
    id: "mental",
    title: "Mental health",
    description: "Confidential support and counselling appointments.",
    cta: "Find mental health support",
    filters: { profession: ["psychologist"] },
  },
];

function Services({
  title = "Popular clinic services",
  services = defaultServices,
  listingPath = "/listing",
  viewAllLabel = "View all clinic services",
}) {
  const baseId = useId();
  const titleId = `${baseId}-title`;

  return (
    <section className="section" aria-labelledby={titleId}>
      <div className={styles["services-container"]}>
        <h2 id={titleId} className={styles["title"]}>
          {title}
        </h2>

        <div className={styles["card-container"]}>
          {services.map(({ id, title, description, cta, image, filters }) => {
            const headingId = `${baseId}-${id}`;
            return (
              <article
                key={id}
                className={`card ${styles["card"]}`}
                aria-labelledby={headingId}
                style={image ? { backgroundImage: `url(${image})` } : undefined}
              >
                <h3 id={headingId}>{title}</h3>
                <p>{description}</p>
                <Link
                  className={styles["link"]}
                  to={listingUrl(listingPath, filters)}
                >
                  {cta}
                </Link>
              </article>
            );
          })}
        </div>

        <Link className={styles["extra-info"]} to={listingPath}>
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}

export default Services;
