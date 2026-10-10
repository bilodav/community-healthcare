import Button from "./Button";
import styles from "./Hero.module.css";
import { useNavigate } from "react-router";

function Hero() {
  return (
    <section
      className={`${styles["hero"]} ${"bg-fade"}`}
      aria-labelledby="hero-title"
    >
      <img src="../src/assets/images/heroImg.png" alt="family hug" />
      <h1 id="hero-title">
        See a healthcare provider when you need one. Hassle Free
      </h1>

      <p>
        Find the right service, check when a practitioner is free, and book in a
        few steps.
      </p>
      <Button text="See a Doctor" onClick={() => navigate("/listing")} />
    </section>
  );
}

export default Hero;
