"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plus,
  GripVertical,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-grid"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-24 text-center md:pb-16 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          New · Smart Zod validation on every form
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl"
        >
          Forms that build themselves.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
        >
          Type a single sentence. Get a complete, validated, shareable form —
          with a live preview, a public link, and a dashboard for responses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/signup">
              Start building free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="#showcase">See how it works</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-xs text-muted-foreground"
        >
          No credit card required · Free for small projects
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative mx-auto max-w-5xl px-4 pb-24"
      >
        <ProductMockup />
      </motion.div>
    </section>
  );
}

function ProductMockup() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
        <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 truncate text-xs text-muted-foreground">
          <span>Customer Feedback · formforge.ai</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr]">
        <div className="border-b p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>Fields</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal normal-case">
              3
            </span>
          </div>
          <motion.div
            className="mt-3 space-y-1.5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.9 },
              },
            }}
          >
            <FieldItem
              icon={<span className="font-semibold">Aa</span>}
              label="Your name"
              type="Short text"
              active
            />
            <FieldItem
              icon={<Star className="h-3 w-3 fill-current" />}
              label="How would you rate us?"
              type="Rating"
            />
            <FieldItem
              icon={<span className="font-semibold">≡</span>}
              label="What can we improve?"
              type="Long text"
            />
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start gap-1.5 text-xs text-muted-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add field
          </Button>
        </div>

        <div className="bg-background p-5 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Generated just now
          </motion.div>

          <motion.div
            className="mt-4 space-y-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.1, delayChildren: 1.2 },
              },
            }}
          >
            <FormField
              label="Your name"
              required
              placeholder="e.g. Alex Johnson"
            />
            <FormRating label="How would you rate us?" required />
            <FormField
              label="What can we improve?"
              placeholder="Share your thoughts..."
              multiline
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.8 }}
            className="mt-6 flex justify-end"
          >
            <Button size="sm" className="gap-1.5">
              Submit feedback
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.0 }}
        className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
          <span className="hidden sm:inline">124 responses today</span>
        </div>
        <span className="font-mono">formforge.ai/f/cf9a2b</span>
      </motion.div>
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function FieldItem({
  icon,
  label,
  type,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  active?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "flex items-center gap-2.5 rounded-md border bg-background px-2.5 py-2",
        active && "border-foreground/30 bg-foreground/[0.03]"
      )}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-muted text-[10px] text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{label}</div>
        <div className="truncate text-[10px] text-muted-foreground">{type}</div>
      </div>
      <GripVertical
        className="h-3.5 w-3.5 text-muted-foreground/40"
        aria-hidden="true"
      />
    </motion.div>
  );
}

function FormField({
  label,
  required,
  placeholder,
  multiline,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <motion.div variants={fieldVariants}>
      <div className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-muted-foreground">*</span>}
      </div>
      <div
        className={cn(
          "mt-1.5 flex rounded-md border bg-background px-3 text-sm text-muted-foreground",
          multiline ? "h-20 items-start py-2" : "h-9 items-center"
        )}
      >
        {placeholder}
      </div>
    </motion.div>
  );
}

function FormRating({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <motion.div variants={fieldVariants}>
      <div className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-muted-foreground">*</span>}
      </div>
      <div
        className="mt-1.5 flex gap-1 text-xl text-amber-500"
        aria-hidden="true"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
    </motion.div>
  );
}
