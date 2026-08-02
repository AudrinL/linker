import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";

const articles = [
  { id: "1", title: "Top 5 Reasons to Study in Germany", subtitle: "Study Abroad", description: "Discover why Germany is becoming the top destination for international students." },
  { id: "2", title: "Navigating the UK Healthcare System", subtitle: "Work Abroad", description: "A guide for newly arrived nurses and healthcare professionals in the UK." },
  { id: "3", title: "Packing for a Safari", subtitle: "Travel Tips", description: "Everything you need to know before heading into the East African wilderness." },
  { id: "4", title: "Understanding Visa Processing Times", subtitle: "Immigration", description: "Why some visas take longer and how to avoid delays." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Linker World Journal" subtitle="Insights, travel guides, and success stories from our community." />
      <main className="shell py-16 lg:py-24">
        <CardList items={articles} />
      </main>
    </div>
  );
}