import type { Metadata } from "next";
import { employerForm } from "@/lib/forms";
import { trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { TrustBar } from "@/components/ui/TrustBar";
import { Notice } from "@/components/ui/Notice";

export const metadata: Metadata = {
  title: "Submit a Job Order",
  description:
    "Tell us about your company's recruitment needs and we will help identify suitable candidates for the positions you need to fill.",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="For Employers"
        title="Submit a job order"
        subtitle="Tell us about your company's recruitment needs and we will help identify suitable candidates for the positions you need to fill."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={employerForm} />
        </div>
        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
