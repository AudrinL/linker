import Hero from "@/components/home/Hero";
import ServiceTiles from "@/components/home/ServiceTiles";
import Manifesto from "@/components/home/Manifesto";
import Services from "@/components/home/Services";
import Proof from "@/components/home/Proof";
import Testimonials from "@/components/home/Testimonials";
import ClosingCTA from "@/components/home/ClosingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceTiles />
      <Manifesto />
      <Services />
      <Proof />
      <Testimonials />
      <ClosingCTA />
    </>
  );
}
