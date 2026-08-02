import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { RichCTA } from "@/components/ui/RichCTA";

const jobs = [
  { id: "1", title: "Registered Nurse", subtitle: "NHS - United Kingdom", tags: ["Healthcare", "Full-time", "Visa Sponsorship"], description: "Join top hospitals in the UK with full relocation support." },
  { id: "2", title: "Software Engineer", subtitle: "TechHub - Germany", tags: ["IT", "Full-time", "Relocation"], description: "Build scalable systems in Berlin. Relocation and visa provided." },
  { id: "3", title: "Hospitality Manager", subtitle: "Oasis Resorts - UAE", tags: ["Hospitality", "Contract", "Accommodation included"], description: "Manage premium resort operations in Dubai." },
  { id: "4", title: "Construction Supervisor", subtitle: "BuildCorp - Qatar", tags: ["Construction", "Full-time"], description: "Oversee major infrastructure projects in Doha." },
  { id: "5", title: "Caregiver", subtitle: "Senior Care - Canada", tags: ["Healthcare", "Full-time"], description: "Provide compassionate care in verified Canadian facilities." },
  { id: "6", title: "Agricultural Worker", subtitle: "Green Farms - Australia", tags: ["Agriculture", "Seasonal"], description: "Seasonal farming roles with accommodation." },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="International Job Board" subtitle="Find verified overseas opportunities curated for East African professionals." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-bone">Featured Opportunities</h2>
            <p className="mt-3 text-mist">Explore jobs with visa sponsorship and relocation support.</p>
          </div>
          <CardList items={jobs} />
        </div>
        <RichCTA title="Ready to advance your career?" description="Upload your CV and let our matching experts find the perfect role for you." buttonText="Submit CV" buttonHref="/contact" />
      </main>
    </div>
  );
}