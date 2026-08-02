import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { RichCTA } from "@/components/ui/RichCTA";

const steps = [
  { title: "Acceptance Letter", description: "Ensure you have an unconditional offer from a recognized institution." },
  { title: "Financial Proof", description: "Compile bank statements and sponsor letters demonstrating sufficient funds." },
  { title: "Visa Application", description: "We guide you through filling out the complex student visa forms." },
  { title: "Biometrics & Interview", description: "Prepare for your consulate appointment with our mock interview sessions." },
  { title: "Visa Approval", description: "Receive your passport and attend our pre-departure orientation." }
];

export default function StudyVisaPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Study Visas" subtitle="Comprehensive support for securing your international student visa." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-bone mb-10 text-center">The Student Visa Process</h2>
          <ProcessSteps steps={steps} />
        </div>
        <RichCTA title="Don't Risk Rejection" description="Our experts have a 98% success rate with student visa applications." buttonText="Start Application" buttonHref="/contact" />
      </main>
    </div>
  );
}