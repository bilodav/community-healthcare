import Hero from "../components/ui/Hero";
import HowItWorks from "../components/ui/HowItWorks";
import Services from "../components/ui/Services";
import Triage from "../components/ui/Triage";

function Landing() {
  return (
    <main id="main" tabIndex={-1}>
      <title>Community Clinic: Book an appointment online</title>
      <meta
        name="description"
        content="Find a clinic service, check when a practitioner is free, and book an appointment in a few steps."
      />
      <Hero />
      <Triage />
      <HowItWorks />
      <Services />
    </main>
  );
}

export default Landing;
