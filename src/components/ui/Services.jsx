import styles from "./Services.module.css";
import { Link } from "react-router";
import { useId } from "react";
import docConsulting from "../../assets/images/docConsulting.jpg";

const defaultServices = [
  {
    id: "general",
    title: "General practice",
    description:
      "Routine appointments, health reviews and referrals with a GP.",
    cta: "Book general practice",
  },
  {
    id: "child", // placeholder: your HTML had General practice twice
    title: "Child health",
    description: "Check-ups, vaccinations and advice for children.",
    cta: "Book child health",
  },
  {
    id: "diabetes",
    title: "Diabetes care",
    description: "Annual reviews, foot checks and diabetic eye screening.",
    cta: "Book diabetes care",
    image: docConsulting,
  },
  {
    id: "eye",
    title: "Eye health",
    description: "Vision tests and retinal screening with our eye clinic team.",
    cta: "Book eye health",
  },
  {
    id: "mental",
    title: "Mental health",
    description: "Confidential support and counselling appointments.",
    cta: "Book mental health",
  },
];

function Services({
  title = "Popular clinic services",
  services = defaultServices,
  bookingPath = "/booking",
  viewAllPath = "/listing",
  viewAllLabel = "View all clinic services",
}) {
  const baseId = useId();
  const titleId = `${baseId}-title`;

  return (
    <section className="section" aria-labelledby={titleId}>
      <div className="container">
        <h2 id={titleId} className={styles["title"]}>
          {title}
        </h2>

        <div className={styles["card-container"]}>
          {services.map(({ id, title, description, cta, image }) => {
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
                  className="btn btn--outline"
                  to={`${bookingPath}?service=${id}`}
                >
                  {cta}
                </Link>
              </article>
            );
          })}
        </div>

        <Link className={styles["extra-info"]} to={viewAllPath}>
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}

export default Services;
