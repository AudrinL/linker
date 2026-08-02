import { PageHero } from "@/components/ui/PageHero";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { RichCTA } from "@/components/ui/RichCTA";

const highlights = [
  { title: "Precision Profiling", description: "We analyze technical skills and cultural fit.", className: "md:col-span-1" },
  { title: "Verified Credentials", description: "Every candidate undergoes strict background checks.", className: "md:col-span-2" },
  { title: "Speed to Hire", description: "Access a pre-vetted pool of ready-to-deploy talent.", className: "md:col-span-2" },
  { title: "Long-term Success", description: "High retention rates through better matching.", className: "md:col-span-1" },
];

export default function EmployerMatchingPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Employer Matching" subtitle="Tailored placement services ensuring the right fit for both candidate and company." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl text-bone mb-6">Why Our Matching Works</h2>
          <p className="text-mist text-lg">We go beyond resumes. Our matching algorithm combined with human expertise ensures that employers get candidates who will thrive and stay long-term.</p>
        </div>
        <BentoGrid items={highlights} />
        <RichCTA title="Start Building Your Team" description="Tell us your hiring needs and let our experts find the perfect match." buttonText="Request Talent" buttonHref="/contact" />
      </main>
    </div>
  );
}