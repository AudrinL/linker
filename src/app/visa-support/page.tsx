import type { Metadata } from "next";
import {
  visaTypes,
  visaServices,
  visaJourney,
  visaDocuments,
  visaWhyUs,
  visaFaqs,
  visaGuides,
  trustMarks,
} from "@/lib/services-data";
import { visaDestinations } from "@/lib/countries";
import { visaEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList, Checklist } from "@/components/ui/FeatureList";
import { DestinationPicker } from "@/components/ui/DestinationPicker";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { Notice } from "@/components/ui/Notice";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Visa Support",
  description:
    "Work, student, tourist, business, family and transit visa support — requirements explained, documents organised and applications prepared from Kigali.",
};

export default function VisaSupportPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Visa Support"
        title="Your journey starts with the right guidance"
        subtitle="We help clients understand visa requirements, organise supporting documents and prepare applications for travel, study, work and family visits."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section>
          <SectionHeading
            eyebrow="Visa services"
            title="Which visa do you need?"
            lede="Six categories, each with its own evidence. Start by finding yours — the requirements diverge sharply after this point."
          />
          <FeatureList features={visaTypes} columns={3} className="mt-12" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Choose your destination"
            title="Where do you want to travel?"
            lede="Pick a destination and we carry it straight into your request."
          />
          <DestinationPicker
            destinations={visaDestinations}
            href="/visa-support/apply"
            className="mt-10"
          />
        </section>

        <section>
          <SectionHeading
            eyebrow="Our visa support"
            title="What the service covers"
            lede="Seven stages, from the first conversation to the flight after approval."
          />
          <FeatureList features={visaServices} className="mt-12" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Know where you stand"
            title="Free eligibility check"
            lede="Two minutes now saves a refused application later. The same screen our consultants run on every file."
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <EligibilityChecker config={visaEligibility} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="The process"
            title="From consultation to travel"
          />
          <ProcessTimeline steps={visaJourney} className="mx-auto mt-10 max-w-2xl" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Documentation"
            title="What may be required"
            lede="Requirements depend on your destination and category. Not every applicant needs all of these — we tell you which apply to you before you start gathering."
          />
          <Checklist items={visaDocuments} columns={3} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Why us" title="Why choose Linker World" />
          <FeatureList features={visaWhyUs} numbered={false} columns={3} className="mt-12" />
        </section>

        <section>
          <SectionHeading eyebrow="Free guides" title="Get approved first time" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {visaGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Visa FAQs" />
          <Faq faqs={visaFaqs.slice(0, 5)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={trustMarks} />

        <Notice title="Important visa notice">
          <p>
            Linker World Travel provides visa application support and guidance.{" "}
            <strong>We do not make visa decisions.</strong> Visa approval or
            refusal is determined solely by the relevant embassy, consulate or
            immigration authority, and submitting an application does not
            guarantee approval.
          </p>
          <p>
            Applicants must provide genuine and accurate information. We will
            not submit false or misleading documents on anyone&rsquo;s behalf.
          </p>
        </Notice>

        <StickyCTA
          title="Need visa support?"
          copy="Tell us where you are going and why. We reply with the document checklist for your category within one working day."
          buttonText="Request visa support"
          buttonHref="/visa-support/apply"
        />
      </main>
    </div>
  );
}
