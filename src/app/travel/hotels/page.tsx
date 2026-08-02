import { PageHero } from "@/components/ui/PageHero";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { RichCTA } from "@/components/ui/RichCTA";

const highlights = [
  { title: "Luxury Resorts", description: "5-star experiences globally.", className: "md:col-span-2", imagePlaceholder: "Resort" },
  { title: "Business Hotels", description: "Conveniently located for work.", className: "md:col-span-1" },
  { title: "Boutique Stays", description: "Unique and cultural accommodations.", className: "md:col-span-1" },
  { title: "Apartments", description: "Long-term stays for expats and students.", className: "md:col-span-2" },
];

export default function HotelsPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Hotels & Accommodation" subtitle="Find premium stays anywhere in the world." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <BentoGrid items={highlights} />
        <RichCTA title="Book Your Stay" description="Contact our agents to access unlisted rates and complimentary upgrades." buttonText="Book Now" buttonHref="/contact" />
      </main>
    </div>
  );
}