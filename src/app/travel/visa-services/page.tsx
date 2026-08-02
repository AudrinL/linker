import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { RichCTA } from "@/components/ui/RichCTA";

const steps = [
  { title: "Consultation", description: "Determine which visa you need (Tourist, Business, Transit)." },
  { title: "Document Review", description: "We check your flight itineraries, hotel bookings, and bank statements." },
  { title: "Form Filling", description: "Accurate completion of embassy forms." },
  { title: "Submission & Appointment", description: "We schedule your embassy appointment and submit the file." }
];

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Travel Visa Services" subtitle="Hassle-free tourist and business visa processing." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div className="max-w-4xl mx-auto">
          <ProcessSteps steps={steps} />
        </div>
        <RichCTA title="Fast-Track Your Visa" description="Don't let paperwork ruin your travel plans." buttonText="Contact Visa Experts" buttonHref="/contact" />
      </main>
    </div>
  );
}