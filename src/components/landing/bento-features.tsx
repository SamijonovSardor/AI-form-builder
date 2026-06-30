"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  MousePointerClick,
  Share2,
  BarChart3,
  Lock,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Everything you need
        </div>
        <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          A complete toolkit. None of the bloat.
        </h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Built for makers who care about craft — and time.
        </p>
      </div>

      <div className="mt-12 grid auto-rows-min gap-4 md:grid-cols-3">
        <BentoCard
          className="md:col-span-2 md:row-span-2"
          icon={<Wand2 className="h-5 w-5" aria-hidden="true" />}
          title="AI-powered generation"
          description="Describe your form in plain English. The AI picks the right fields, types, and labels — and validates them with Zod."
        >
          <AIVisual />
        </BentoCard>

        <BentoCard
          icon={
            <MousePointerClick className="h-5 w-5" aria-hidden="true" />
          }
          title="Visual editor"
          description="Drag, drop, reorder. A live preview keeps everything in sync."
        />

        <BentoCard
          icon={<Share2 className="h-5 w-5" aria-hidden="true" />}
          title="One link, anywhere"
          description="Send, embed, or share on social. Every form gets a public URL instantly."
        >
          <LinkVisual />
        </BentoCard>

        <BentoCard
          className="md:col-span-2"
          icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
          title="Real-time response dashboard"
          description="Watch responses stream in. See trends, export data, never miss a submission."
        >
          <DashboardVisual />
        </BentoCard>

        <BentoCard
          icon={<Lock className="h-5 w-5" aria-hidden="true" />}
          title="Validated by Zod"
          description="Every field gets a runtime schema. No more broken data."
        />
      </div>
    </section>
  );
}

function BentoCard({
  className,
  icon,
  title,
  description,
  children,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-colors hover:border-foreground/30 md:p-8",
        className
      )}
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/80">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold md:text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}

function AIVisual() {
  const fields = ["Your name", "Email address", "Position", "Cover letter"];
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        AI is generating fields
      </div>
      <div className="mt-3 space-y-1.5">
        {fields.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="flex items-center gap-2 rounded border bg-background px-2.5 py-1.5"
          >
            <Check
              className="h-3 w-3 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <span className="text-xs">{label}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              + field
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LinkVisual() {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-2.5 py-1.5">
        <LinkIcon
          className="h-3 w-3 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          formforge.ai/f/abc123
        </span>
        <span className="ml-auto rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300">
          Live
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        124 responses today
      </div>
    </div>
  );
}

function DashboardVisual() {
  const data = [35, 55, 30, 75, 50, 85, 65, 90, 60, 95, 70, 88];
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>Responses · last 30 days</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium normal-case">
          + 24%
        </span>
      </div>
      <div className="mt-3 flex h-28 items-end gap-1.5">
        {data.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
            className={cn(
              "flex-1 rounded-t",
              i === data.length - 1 ? "bg-blue-500" : "bg-foreground/85"
            )}
          />
        ))}
      </div>
    </div>
  );
}
