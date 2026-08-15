import type { Metadata } from "next";
import { cvForm } from "@/lib/forms";
import { trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Submit Your CV",
  description:
    "Create your profile and tell us where and what type of work you are looking for. We contact you when a suitable opportunity matches.",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="For Job Seekers"
        title="Submit your CV"
        subtitle="Create your profile and tell us where and what type of work you are looking for. We contact you when a suitable opportunity matches."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={cvForm} />
        </div>
        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
