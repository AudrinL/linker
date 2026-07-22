import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Services from "@/components/home/Services";
import SafariShowcase from "@/components/home/SafariShowcase";
import Proof from "@/components/home/Proof";
import Testimonials from "@/components/home/Testimonials";
import ClosingCTA from "@/components/home/ClosingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <SafariShowcase />
      <Proof />
      <Testimonials />
      <ClosingCTA />
    </>
  );
}
