import type { Metadata } from "next";
import { site } from "@/lib/site";
import { timeline, values, stats } from "@/lib/content";
import { partnerMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "About — Linker World Travel",
  description:
    "Since 2014, Linker World Travel has connected people to opportunity worldwide — recruitment, visas, travel, safaris and vehicle import & export, handled end to end from Kigali.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Connecting Africa to the world"
        subtitle="Since 2014, one team in Kigali has moved people and opportunity across four continents — honestly, end to end."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">The story</p>
          <p className="mt-6 text-xl leading-relaxed text-mist">
            {site.description}
          </p>
        </section>

        <section>
          <SectionHeading
            eyebrow="Since 2014"
            title="The milestones"
            lede="A desk and a promise became five services and thirty-eight countries."
          />
          <ol className="mt-12 relative border-l border-mist/20 pl-8 ml-2 space-y-12">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[41px] top-1 size-4 rounded-full border-2 border-gold bg-abyss" />
                <span className="font-display text-3xl tracking-tight text-gold">
                  {item.year}
                </span>
                <h3 className="mt-2 font-display text-xl tracking-tight text-bone">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-mist">
                  {item.copy}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionHeading
            eyebrow="What we believe"
            title="Four rules we don't break"
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-8"
              >
                <span className="font-display text-4xl text-gold/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl tracking-tight text-bone">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="In numbers" title="The proof" center />
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-mist/15 bg-mist/15 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-ink-soft/80 px-6 py-8 text-center">
                <dd className="font-display text-3xl tracking-tight text-gold sm:text-4xl">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </dd>
                <dt className="mt-2 text-xs uppercase tracking-[0.15em] text-mist">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>

        <TrustBar items={partnerMarks} />

        <StickyCTA
          title="Let's talk about where you're going"
          copy="Five services, one team, one phone number. Tell us about your plans and we'll tell you honestly what it takes."
          buttonText="Talk to a consultant"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
