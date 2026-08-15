"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { jobs, jobCountries, jobSkillLevels, jobEmploymentTypes, type Job } from "@/lib/jobs";
import { sectors } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { inputCls, labelCls } from "@/components/forms/fields";

/**
 * The vacancy board with its filters.
 *
 * Filtering happens in the browser over a static list — there is no search
 * backend yet, and at this volume there does not need to be. The grouping by
 * country is deliberate: candidates decide where before they decide what, so
 * the board reads as a set of country sections rather than one long list.
 */

function JobCard({ job }: { job: Job }) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden className="text-2xl leading-none">
          {job.icon}
        </span>
        <span className="shrink-0 rounded-full bg-mist/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-mist">
          {job.employment}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl tracking-tight text-bone">
        {job.title}
      </h3>
      <p className="mt-1.5 text-sm text-mist">
        {job.flag} {job.country} · {job.sector}
      </p>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="shrink-0 text-mist">Experience:</dt>
          <dd className="text-bone/85">{job.experience}</dd>
        </div>
        {job.language && (
          <div className="flex gap-2">
            <dt className="shrink-0 text-mist">Language:</dt>
            <dd className="text-bone/85">{job.language}</dd>
          </div>
        )}
      </dl>

      <p className="mt-5 font-display text-lg tracking-tight text-gold">
        {job.salary}
      </p>

      <div className="mt-6 flex flex-1 items-end gap-3">
        <Link
          href={`/jobs/${job.slug}`}
          className="rounded-full border border-mist/25 px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
        >
          View job
        </Link>
        <Link
          href={`/work-abroad/apply?country=${encodeURIComponent(job.country)}&role=${encodeURIComponent(job.title)}`}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors duration-500 hover:bg-bone"
        >
          Apply now
        </Link>
      </div>
    </article>
  );
}

const ANY = "";

export default function JobBoard() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(ANY);
  const [sector, setSector] = useState(ANY);
  const [employment, setEmployment] = useState(ANY);
  const [skill, setSkill] = useState(ANY);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (country && j.country !== country) return false;
      if (sector && j.sector !== sector) return false;
      if (employment && !j.employment.includes(employment)) return false;
      if (skill && j.skill !== skill) return false;
      if (!q) return true;
      return [j.title, j.sector, j.country, j.summary]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, country, sector, employment, skill]);

  /** Preserve the board's country order rather than the filter order. */
  const grouped = useMemo(() => {
    const order = jobCountries.map((c) => c.name);
    const map = new Map<string, Job[]>();
    for (const j of filtered) {
      if (!map.has(j.country)) map.set(j.country, []);
      map.get(j.country)!.push(j);
    }
    return order
      .filter((name) => map.has(name))
      .map((name) => ({
        name,
        flag: jobCountries.find((c) => c.name === name)!.flag,
        items: map.get(name)!,
      }));
  }, [filtered]);

  const active = !!(query || country || sector || employment || skill);

  const reset = () => {
    setQuery("");
    setCountry(ANY);
    setSector(ANY);
    setEmployment(ANY);
    setSkill(ANY);
  };

  const selectCls = cn(inputCls, "appearance-none bg-ink py-3");

  return (
    <div>
      {/* ---------------------------- filters ---------------------------- */}
      <div
        id="search"
        className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/50 p-6 sm:p-8"
      >
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="lg:col-span-3">
            <label htmlFor="job-search" className={labelCls}>
              Search by job
            </label>
            <input
              id="job-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or keyword — e.g. caregiver, welder, driver"
              className={cn(inputCls, "mt-3")}
            />
          </div>

          <div>
            <label htmlFor="f-country" className={labelCls}>
              Country
            </label>
            <select
              id="f-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={cn(selectCls, "mt-3")}
            >
              <option value="">All countries</option>
              {jobCountries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-sector" className={labelCls}>
              Sector
            </label>
            <select
              id="f-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className={cn(selectCls, "mt-3")}
            >
              <option value="">All sectors</option>
              {sectors
                .filter((s) => jobs.some((j) => j.sector === s))
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-employment" className={labelCls}>
              Employment type
            </label>
            <select
              id="f-employment"
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
              className={cn(selectCls, "mt-3")}
            >
              <option value="">All types</option>
              {jobEmploymentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <span className={labelCls}>Skill level</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {jobSkillLevels.map((s) => {
                const on = skill === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkill(on ? ANY : s)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300",
                      on
                        ? "border-gold bg-gold text-white"
                        : "border-mist/25 text-mist hover:border-gold/60 hover:text-bone",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-mist/10 pt-5">
          <p aria-live="polite" className="text-sm text-mist">
            <span className="font-medium text-bone">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "vacancy" : "vacancies"}
            {active
              ? filtered.length === 1
                ? " matches your filters"
                : " match your filters"
              : " currently listed"}
          </p>
          {active && (
            <button
              type="button"
              onClick={reset}
              className="text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------- results ---------------------------- */}
      {grouped.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/40 p-12 text-center">
          <h3 className="font-display text-2xl text-bone">
            No vacancies match those filters
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-mist">
            New roles are added as employers confirm them. Submit your CV and we
            will contact you when something matching your profile opens.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors hover:border-gold/70 hover:text-gold"
            >
              Clear filters
            </button>
            <Link
              href="/submit-cv"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bone"
            >
              Submit my CV
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-16 space-y-16">
          {grouped.map((group) => (
            <section key={group.name}>
              <h2 className="font-display text-2xl tracking-tight text-bone sm:text-3xl">
                <span aria-hidden>{group.flag}</span> {group.name} opportunities
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
