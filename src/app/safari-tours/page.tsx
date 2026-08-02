import { PageHero } from "@/components/ui/PageHero";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { RichCTA } from "@/components/ui/RichCTA";

const safaris = [
  { title: "Gorilla Trekking", description: "Volcanoes National Park, Rwanda.", className: "md:col-span-2", imagePlaceholder: "Gorilla" },
  { title: "Great Migration", description: "Serengeti & Maasai Mara.", className: "md:col-span-1", imagePlaceholder: "Migration" },
  { title: "Big Five Drive", description: "Akagera National Park.", className: "md:col-span-1", imagePlaceholder: "Lion" },
  { title: "Luxury Lodges", description: "Stay in the heart of the wild.", className: "md:col-span-2", imagePlaceholder: "Lodge" },
];

export default function SafariToursPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="East African Safaris" subtitle="Experience the wild beauty of Rwanda, Kenya, and Tanzania." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <BentoGrid items={safaris} />
        <RichCTA title="Into the Wild" description="Book an unforgettable safari experience tailored to your schedule." buttonText="Book Safari" buttonHref="/contact" />
      </main>
    </div>
  );
}