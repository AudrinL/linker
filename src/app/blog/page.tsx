"use client";

import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <PageHero 
        title="Linker World Journal"
        subtitle="Insights, travel guides, and success stories from our community."
      />
      <main className="shell py-16 lg:py-24 space-y-12">
        <PlaceholderSection 
          title="Blog Feed"
          description="Grid of latest articles and news updates."
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
