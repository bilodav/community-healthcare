import styles from "./Hero.module.css";
import { Link } from "react-router";
import heroImg from "../../assets/images/heroImg.png";

function Hero() {
  return (
    <section
      className={`${styles["hero"]} ${"bg-fade"}`}
      aria-labelledby="hero-title"
    >
      <img src={heroImg} alt="Mother and Daughter embracing eachother" />
      <h1 id="hero-title">
        See a healthcare provider when you need one. Hassle Free
      </h1>

      <p>
        Find the right service, check when a practitioner is free, and book in a
        few steps.
      </p>
      <Link className="btn-primary" to="/listing">
        See a Doctor
      </Link>
    </section>
  );
}

export default Hero;
