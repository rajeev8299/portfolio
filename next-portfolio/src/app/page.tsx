import BackgroundEffects from "@/components/BackgroundEffects";
import IntroOverlay from "@/components/IntroOverlay";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DevShowcase from "@/components/DevShowcase";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import InteractiveCards from "@/components/InteractiveCards";

export default function Home() {
  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <IntroOverlay />
      <InteractiveCards />

      <main>
        <Hero />
        <DevShowcase />
        <Ticker />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
