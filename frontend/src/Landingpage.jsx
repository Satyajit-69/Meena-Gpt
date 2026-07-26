import About from "./About";
import Features from "./Features";
import Home from "./Home";
import HowItWorks from "./Howitworks";

function LandingPage() {
  return (
    <main id="landing-page">
      <Home />
      <About />
      <HowItWorks />
      <Features />
    </main>
  );
}

export default LandingPage;
