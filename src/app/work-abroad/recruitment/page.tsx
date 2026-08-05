import type { Metadata } from "next";
import { workAbroadProcess, workFaqs, partnerMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Faq } from "@/components/ui/Faq";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Overseas Recruitment — Linker World Travel",
  description:
    "We connect skilled talent with trusted international employers — screening, verification, matching and post-placement support, end to end from Kigali.",
};

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Overseas Recruitment"
        subtitle="We connect skilled talent with trusted international employers."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="How it works"
            title="Our recruitment process"
            lede="Five stages, one team, zero handoffs into a void."
          />
          <ProcessTimeline steps={workAbroadProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Recruitment FAQs" />
          <Faq faqs={workFaqs.slice(0, 4)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={partnerMarks} />

        <StickyCTA
          title="Ready for an international career?"
          copy="Submit your profile and documents — we review every application within one working day."
          buttonText="Apply now"
          buttonHref="/work-abroad/apply"
        />
      </main>
    </div>
  );
}
