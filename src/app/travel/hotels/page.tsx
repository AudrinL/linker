"use client";

import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function TravelHotelsPage() {
  return (
    <div className="min-h-screen">
      <PageHero 
        title="Hotels & Accommodation"
        subtitle="Find premium stays anywhere in the world."
      />
      <main className="shell py-16 lg:py-24 space-y-12">
        <PlaceholderSection 
          title="Accommodation Finder"
          description="Featured hotels and destination search."
          height="min-h-[500px]"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PlaceholderSection 
            title="Additional Info"
            description="Content block for details or FAQs."
            height="min-h-[300px]"
          />
          <PlaceholderSection 
            title="Call to Action"
            description="A localized CTA or contact form snippet."
            height="min-h-[300px]"
          />
        </div>
      </main>
    </div>
  );
}
