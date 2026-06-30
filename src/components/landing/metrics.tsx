"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Stats() {
  return (
    <section className="border-y py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-3">
          <Stat end={10000} suffix="+" label="Forms created" />
          <Stat
            end={500000}
            format="compact"
            suffix="+"
            label="Responses collected"
          />
          <Stat
            end={2.3}
            suffix="s"
            label="Average generation time"
            decimals={1}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  end,
  suffix,
  label,
  format,
  decimals,
}: {
  end: number;
  suffix?: string;
  label: string;
  format?: "compact";
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (current >= steps) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, [inView, end]);

  const display =
    format === "compact"
      ? Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(count)
      : decimals
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-5xl font-semibold tracking-tight md:text-6xl">
        {display}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

const techs = [
  "Next.js 16",
  "Appwrite",
  "TypeScript",
  "Tailwind CSS",
  "Zod",
  "React Hook Form",
  "Radix UI",
  "Framer Motion",
];

export function TechMarquee() {
  return (
    <section className="border-y py-12">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Built with the best tools
        </p>
      </div>
      <div className="relative mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 px-6">
          {[...techs, ...techs].map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap text-2xl font-semibold text-muted-foreground/40"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-foreground/30"
                aria-hidden="true"
              />
              {tech}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="border-y bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Free to start · 10 seconds to your first form
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl"
        >
          Ready to ship your first form?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          It takes about ten seconds. We promise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="#showcase">See how it works</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-xs text-muted-foreground"
        >
          No credit card required
        </motion.p>
      </div>
    </section>
  );
}
