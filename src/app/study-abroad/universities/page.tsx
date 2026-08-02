import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { RichCTA } from "@/components/ui/RichCTA";

const universities = [
  { id: "1", title: "University of Toronto", subtitle: "Canada", tags: ["Engineering", "Business", "Medicine"], description: "A globally ranked public research university in Toronto, Ontario." },
  { id: "2", title: "University of Melbourne", subtitle: "Australia", tags: ["Research", "Arts", "Science"], description: "Australia's leading university for academic excellence and research." },
  { id: "3", title: "Technical University of Munich", subtitle: "Germany", tags: ["Technology", "Engineering", "Tuition-Free"], description: "One of Europe's top universities for STEM programs." },
  { id: "4", title: "University of Manchester", subtitle: "United Kingdom", tags: ["Business", "Humanities", "Law"], description: "A prestigious red brick university in the heart of the UK." },
  { id: "5", title: "New York University", subtitle: "United States", tags: ["Arts", "Finance", "Media"], description: "A premier private university located in New York City." },
  { id: "6", title: "National University of Singapore", subtitle: "Singapore", tags: ["Technology", "Business"], description: "Asia's leading university offering global perspectives." },
];

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Partner Universities" subtitle="Gain admission to top-tier educational institutions worldwide." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-bone">Explore Top Destinations</h2>
            <p className="mt-3 text-mist">We have direct partnerships with institutions across the globe.</p>
          </div>
          <CardList items={universities} />
        </div>
        <RichCTA title="Find Your Dream School" description="Speak to our academic counselors to find the best fit for your goals and budget." buttonText="Book Counseling" buttonHref="/contact" />
      </main>
    </div>
  );
}