"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How does the AI generation work?",
    a: 'Type a description of your form — for example, "a job application with name, email, resume, and cover letter". Our AI picks the right field types, adds validation rules, and generates a Zod schema. You can edit everything visually afterwards.',
  },
  {
    q: "Can I customize the look of my form?",
    a: "Yes. Every form is fully customizable — labels, placeholders, validation messages, success pages. You can also embed forms on your own site with custom CSS.",
  },
  {
    q: "Where is my data stored?",
    a: "All data is stored in Appwrite, a secure backend-as-a-service with encryption at rest. You own your data. We never sell or share it with third parties.",
  },
  {
    q: "Do you support webhooks and integrations?",
    a: "Yes. Pro plans include webhooks so you can send submissions to your own backend, Zapier, Make, Slack, or anywhere else. Native integrations with Zapier and Make are included.",
  },
  {
    q: "Can I export my responses?",
    a: "Yes. Export to CSV or JSON, or pull data via our REST API. All plans include unlimited exports.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 3 forms and 100 responses per month — perfect for personal projects and small teams getting started. No credit card required.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-y py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Questions, answered.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground md:text-lg"
          >
            Everything you need to know about FormForge AI.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 overflow-hidden rounded-2xl border bg-card shadow-sm"
        >
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={cn(
                  "border-b last:border-b-0",
                  i === 0 && "border-t"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/30"
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
