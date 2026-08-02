import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { RichCTA } from "@/components/ui/RichCTA";

const steps = [
  { title: "Vehicle Selection", description: "Choose a vehicle from our global inventory (Japan, Europe, UAE)." },
  { title: "Purchase & Shipping", description: "We handle the secure purchase and ocean freight logistics." },
  { title: "Customs Clearance", description: "Smooth processing through East African ports and borders." },
  { title: "Delivery & Registration", description: "The vehicle is delivered to your door, fully registered." }
];

export default function VehicleImportExportPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Vehicle Import & Export" subtitle="Reliable cross-border vehicle logistics and purchasing assistance." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div className="max-w-4xl mx-auto">
          <ProcessSteps steps={steps} />
        </div>
        <RichCTA title="Looking for a specific car?" description="Tell us the make and model, and we'll source it for you." buttonText="Source a Vehicle" buttonHref="/contact" />
      </main>
    </div>
  );
}