import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { RichCTA } from "@/components/ui/RichCTA";

const steps = [
  { title: "Initial Screening", description: "Submit your CV. Our team reviews your skills and qualifications to understand your career goals." },
  { title: "Skills Verification", description: "We conduct interviews and verify credentials to ensure you meet international standards." },
  { title: "Employer Matching", description: "We align your profile with open vacancies from our trusted network of global employers." },
  { title: "Interview Preparation", description: "Receive 1-on-1 coaching to excel in your interviews with overseas companies." },
  { title: "Placement & Onboarding", description: "Once hired, we assist with the transition, paperwork, and pre-departure briefings." }
];

const highlights = [
  { title: "Global Network", description: "Partnerships across Europe, Middle East, and North America.", className: "md:col-span-2" },
  { title: "Ethical Recruiting", description: "No hidden fees. Transparent processes." },
  { title: "Post-Placement Support", description: "We ensure you settle comfortably in your new country.", className: "md:col-span-3" },
];

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Overseas Recruitment" subtitle="We connect skilled talent with trusted international employers." />
      <main className="shell py-16 lg:py-24 space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl text-bone mb-8">Our Recruitment Process</h2>
            <ProcessSteps steps={steps} />
          </div>
          <div>
            <BentoGrid items={highlights} />
          </div>
        </div>
        <RichCTA title="Employers: Looking for talent?" description="Partner with us to source pre-vetted, highly skilled professionals from East Africa." buttonText="Partner With Us" buttonHref="/contact" />
      </main>
    </div>
  );
}