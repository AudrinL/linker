import { PageHero } from "@/components/ui/PageHero";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { RichCTA } from "@/components/ui/RichCTA";

const highlights = [
  { title: "Course Selection", description: "We map your career goals to the right programs.", className: "md:col-span-1" },
  { title: "Essay & SOP Reviews", description: "Stand out with compelling personal statements.", className: "md:col-span-2" },
  { title: "Scholarship Sourcing", description: "Find funding opportunities to reduce costs.", className: "md:col-span-2" },
  { title: "Application Tracking", description: "We manage deadlines and submissions for you.", className: "md:col-span-1" },
];

export default function AdmissionGuidancePage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Admission Guidance" subtitle="From application essays to scholarships, we guide you every step of the way." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <BentoGrid items={highlights} />
        <RichCTA title="Secure Your Spot" description="Let us handle the stress of university applications so you can focus on your studies." buttonText="Get Started" buttonHref="/contact" />
      </main>
    </div>
  );
}