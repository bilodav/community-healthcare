import Hero from "../components/ui/Hero";
import HowItWorks from "../components/ui/HowItWorks";
import Services from "../components/ui/Services";
import Triage from "../components/ui/Triage";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <main id="main" tabindex="-1">
      <Hero />
      <Triage />
      <HowItWorks />
      <Services />
    </main>
  );
}

export default Landing;
