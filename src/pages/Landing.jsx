import Hero from "../components/ui/Hero";
import Triage from "../components/ui/Triage";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <main id="main" tabindex="-1">
      <Hero />
      <Triage />
    </main>
  );
}

export default Landing;
