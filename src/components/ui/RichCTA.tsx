"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RichCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function RichCTA({ title, description, buttonText, buttonHref, className }: RichCTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("relative overflow-hidden rounded-3xl bg-mist/5 px-6 py-16 text-center sm:px-12 md:py-24", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="font-display text-3xl text-bone sm:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-mist">{description}</p>
        <div className="mt-10">
          <Link
            href={buttonHref}
            className="inline-flex rounded-full bg-gold px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-bone"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
