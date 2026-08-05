import Link from "next/link";
import { cn } from "@/lib/utils";

type StickyCTAProps = {
  title: string;
  copy: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
};

/** Slim, always-on conversion strip for the bottom of service pages. */
export function StickyCTA({ title, copy, buttonText, buttonHref, className }: StickyCTAProps) {
  return (
    <section
      className={cn(
        "glass relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-60" />
      <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-bone sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-mist">
            {copy}
          </p>
        </div>
        <Link
          href={buttonHref}
          className="inline-flex shrink-0 rounded-full bg-gold px-8 py-4 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
