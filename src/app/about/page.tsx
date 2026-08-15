import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import {
  aboutServices,
  howWeWork,
  aboutWhyUs,
  globalReach,
  trustMarks,
} from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList, Checklist } from "@/components/ui/FeatureList";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Linker World Travel is a travel, education and global mobility company helping people work, study, travel and build their future internationally — from Kigali.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="About Us"
        title="Connecting people with global opportunities"
        subtitle={`${site.name} is a travel, education and global mobility company helping individuals explore opportunities to work, study, travel and build their future internationally.`}
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our mission" title="Make opportunity legible" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-mist">
              Our mission is to make international opportunities easier to
              understand and access. We connect people with suitable work
              opportunities, study programs, travel services and visa
              application support — and we give clear information at every
              stage, including when the answer is no.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Our vision" title="A trusted mobility partner" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-mist">
              To become a trusted global mobility partner connecting people,
              employers, educational institutions and travel opportunities
              across borders — so that more people can confidently take the next
              step toward their international goals.
            </p>
          </div>
        </section>

        {/* ---------------------------- what we do -------------------------- */}
        <section>
          <SectionHeading
            eyebrow="What we do"
            title="Four services, one team"
            lede="Support with practical guidance throughout the journey — from finding an opportunity to boarding the plane."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {aboutServices.map((s) => (
              <div
                key={s.title}
                className="flex flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-8"
              >
                <h3 className="font-display text-2xl tracking-tight text-bone">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{s.intro}</p>
                <Checklist items={s.items} columns={1} className="mt-6 flex-1" />
                <Link
                  href={s.cta.href}
                  className="mt-7 inline-flex w-fit rounded-full border border-mist/25 px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
                >
                  {s.cta.label}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------ seekers / employers --------------------- */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-gold/25 bg-gold/[0.05] p-8">
            <p className="eyebrow">For job seekers</p>
            <h3 className="mt-4 font-display text-2xl tracking-tight text-bone">
              Looking for work abroad?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Create your profile and tell us about your skills, experience and
              preferred destination.
            </p>
            <Link
              href="/submit-cv"
              className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-colors duration-500 hover:bg-bone"
            >
              Submit my CV
            </Link>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-8">
            <p className="eyebrow">For employers</p>
            <h3 className="mt-4 font-display text-2xl tracking-tight text-bone">
              Looking for qualified workers?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Submit your recruitment requirements and tell us about the
              positions you need to fill.
            </p>
            <Link
              href="/employers"
              className="mt-6 inline-flex rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
            >
              Submit a job order
            </Link>
          </div>
        </section>

        {/* -------------------------- global approach ----------------------- */}
        <section>
          <SectionHeading
            eyebrow="Our global approach"
            title="Where we work"
            lede="Opportunities and services connected to destinations around the world."
          />
          <div className="mt-10 flex flex-wrap gap-2.5">
            {globalReach.map((c) => (
              <span
                key={c}
                className="rounded-full border border-mist/18 bg-ink-soft/50 px-4 py-2 text-sm tracking-tight text-bone"
              >
                {c}
              </span>
            ))}
            <span className="rounded-full border border-mist/18 bg-ink-soft/50 px-4 py-2 text-sm tracking-tight text-muted">
              🌍 And other destinations
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Availability and eligibility vary by country, employer, institution
            and program.
          </p>
        </section>

        <section>
          <SectionHeading eyebrow="Why us" title="Why choose Linker World" />
          <FeatureList features={aboutWhyUs} numbered={false} columns={3} className="mt-12" />
        </section>

        <section>
          <SectionHeading
            eyebrow="How we work"
            title="From first conversation to departure"
          />
          <ProcessTimeline steps={howWeWork} className="mx-auto mt-10 max-w-2xl" />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/50 p-8 sm:p-10">
          <p className="eyebrow">Our commitment</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl tracking-tight text-bone">
            Clear information, professional assistance, responsible guidance
          </h2>
          <p className="mt-5 max-w-3xl text-[0.95rem] leading-relaxed text-mist">
            We encourage every applicant to provide accurate information and
            complete documentation, and to verify important requirements with
            the relevant employer, educational institution, embassy or
            government authority. We would rather tell you a route will not work
            than take your money to find out.
          </p>
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Your journey to the world starts here"
          copy="Whether you want to work abroad, study abroad, apply for a visa or book a flight, we are ready to help you take the next step."
          buttonText="Contact us"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
