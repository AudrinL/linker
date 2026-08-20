import Hero from "@/components/home/Hero";
import ServiceTiles from "@/components/home/ServiceTiles";
import Steps from "@/components/home/Steps";
import Proof from "@/components/home/Proof";
import LeadCTA from "@/components/home/LeadCTA";

/**
 * The home page, in five sections that each do one job: what we offer, which
 * one is yours, what happens if you ask, why you should believe us, and the
 * form that starts it.
 *
 * It was seven sections and roughly twelve screens of scrolling, which said
 * the same things more than once — the four services appeared as a tile grid
 * and again as four full-height photographic panels; the four statistics
 * appeared in the hero and again in a section of their own. Removing the
 * repetition, the manifesto and six of the eight photographs is most of the
 * change. Adding a form to the last section is the rest.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ServiceTiles />
      <Steps />
      <Proof />
      <LeadCTA />
    </>
  );
}
