"use client";

import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function WorkAbroadEmployerMatchingPage() {
  return (
    <div className="min-h-screen">
      <PageHero 
        title="Employer Matching"
        subtitle="Tailored placement services ensuring the right fit for both candidate and company."
      />
      <main className="shell py-16 lg:py-24 space-y-12">
        <PlaceholderSection 
          title="Matching Portal / Steps"
          description="Infographic or step-by-step section explaining the matching criteria."
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
