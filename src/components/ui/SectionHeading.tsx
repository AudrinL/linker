import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  center?: boolean;
  className?: string;
};

/** Shared section heading — eyebrow, display title, lede. */
export function SectionHeading({ eyebrow, title, lede, center, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 font-display text-3xl tracking-tight text-bone sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 text-lg leading-relaxed text-mist">{lede}</p>
      )}
    </div>
  );
}
