import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { RichCTA } from "@/components/ui/RichCTA";

const steps = [
  { title: "Eligibility Assessment", description: "We review your profile and job offer to determine the correct permit category." },
  { title: "Document Compilation", description: "Assistance gathering police clearances, medical reports, and certified translations." },
  { title: "Application Submission", description: "We handle the accurate completion and filing of immigration forms." },
  { title: "Embassy Liaison", description: "Tracking the status and communicating with consulates on your behalf." },
  { title: "Passport Stamping", description: "Finalizing the process and returning your passport with the work visa." }
];

export default function WorkPermitsPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Work Permits & Visas" subtitle="Expert guidance on navigating international labor laws and permit applications." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-bone mb-10 text-center">The Application Journey</h2>
          <ProcessSteps steps={steps} />
        </div>
        <RichCTA title="Need Visa Assistance?" description="Avoid costly mistakes. Let our immigration experts handle your paperwork." buttonText="Get Consultation" buttonHref="/contact" />
      </main>
    </div>
  );
}