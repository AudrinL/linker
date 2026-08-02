import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { RichCTA } from "@/components/ui/RichCTA";

const packages = [
  { id: "1", title: "Dubai Extravaganza", subtitle: "5 Days / 4 Nights", tags: ["Shopping", "Desert Safari", "Family"], description: "Experience luxury shopping and thrilling desert safaris." },
  { id: "2", title: "European Romance", subtitle: "10 Days / 9 Nights", tags: ["Couples", "Culture", "Multi-city"], description: "Paris, Venice, and Rome in one unforgettable trip." },
  { id: "3", title: "Seychelles Escape", subtitle: "7 Days / 6 Nights", tags: ["Beach", "Relaxation"], description: "Pristine beaches and luxury resorts in the Indian Ocean." },
];

export default function HolidayPackagesPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Holiday Packages" subtitle="Curated international getaways tailored to your preferences." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <CardList items={packages} />
        <RichCTA title="Custom Itineraries Available" description="Want something different? We can tailor a package exactly to your dreams." buttonText="Plan My Trip" buttonHref="/contact" />
      </main>
    </div>
  );
}