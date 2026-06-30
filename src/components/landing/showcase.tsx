"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldKind = "input" | "textarea" | "select" | "rating" | "radio" | "checkboxes";

type Field = {
  label: string;
  required?: boolean;
  kind: FieldKind;
  placeholder?: string;
  options?: string[];
};

type Template = {
  id: string;
  name: string;
  prompt: string;
  fields: Field[];
};

const templates: Template[] = [
  {
    id: "feedback",
    name: "Customer feedback",
    prompt: "A customer feedback form with name, rating, and comments",
    fields: [
      {
        label: "Your name",
        required: true,
        kind: "input",
        placeholder: "e.g. Alex Johnson",
      },
      {
        label: "How would you rate us?",
        required: true,
        kind: "rating",
      },
      {
        label: "What can we improve?",
        kind: "textarea",
        placeholder: "Share your thoughts...",
      },
    ],
  },
  {
    id: "job",
    name: "Job application",
    prompt: "A job application form with name, email, position, and cover letter",
    fields: [
      {
        label: "Full name",
        required: true,
        kind: "input",
        placeholder: "Jane Doe",
      },
      {
        label: "Email address",
        required: true,
        kind: "input",
        placeholder: "jane@example.com",
      },
      {
        label: "Phone number",
        kind: "input",
        placeholder: "+1 (555) 000-0000",
      },
      {
        label: "Position",
        required: true,
        kind: "select",
        options: [
          "Frontend Engineer",
          "Backend Engineer",
          "Designer",
          "Product Manager",
        ],
      },
      {
        label: "Cover letter",
        kind: "textarea",
        placeholder: "Tell us about yourself...",
      },
    ],
  },
  {
    id: "event",
    name: "Event registration",
    prompt:
      "An event registration form with name, email, ticket type, and dietary preferences",
    fields: [
      {
        label: "Full name",
        required: true,
        kind: "input",
        placeholder: "Alex Johnson",
      },
      {
        label: "Email address",
        required: true,
        kind: "input",
        placeholder: "alex@example.com",
      },
      {
        label: "Ticket type",
        required: true,
        kind: "radio",
        options: ["General admission", "VIP", "Student"],
      },
      {
        label: "Dietary preferences",
        kind: "checkboxes",
        options: [
          "Vegetarian",
          "Vegan",
          "Gluten-free",
          "No restrictions",
        ],
      },
    ],
  },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const template = templates[active]!;

  return (
    <section id="showcase" className="relative border-y bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            See it in action
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl"
          >
            One sentence. A complete form.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground md:text-lg"
          >
            Pick a template and watch a real form get built from a single
            prompt.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-10 flex w-full max-w-md items-center justify-center rounded-full border bg-background p-1 shadow-sm"
        >
          {templates.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all",
                i === active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.name}
            </button>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
                <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Prompt
                  </div>
                  <div className="mt-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                    {template.prompt}
                  </div>
                </div>

                <div className="bg-background p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Generated
                    </span>
                  </div>

                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.07 } },
                    }}
                    key={template.id}
                  >
                    {template.fields.map((field, i) => (
                      <motion.div
                        key={`${template.id}-${i}`}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.3 },
                          },
                        }}
                      >
                        <FieldRenderer field={field} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FieldRenderer({ field }: { field: Field }) {
  return (
    <div>
      <div className="text-sm font-medium">
        {field.label}
        {field.required && <span className="ml-0.5 text-muted-foreground">*</span>}
      </div>
      <div className="mt-1.5">
        {field.kind === "input" && (
          <div className="flex h-9 items-center rounded-md border bg-background px-3 text-sm text-muted-foreground">
            {field.placeholder}
          </div>
        )}
        {field.kind === "textarea" && (
          <div className="flex h-20 items-start rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            {field.placeholder}
          </div>
        )}
        {field.kind === "select" && (
          <div className="flex h-9 items-center justify-between rounded-md border bg-background px-3 text-sm text-muted-foreground">
            <span>Select an option</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
        {field.kind === "rating" && (
          <div
            className="flex gap-1 text-xl text-amber-500"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        )}
        {field.kind === "radio" && (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <span className="grid h-4 w-4 place-items-center rounded-full border border-input">
                  <span className="h-2 w-2 rounded-full bg-transparent" />
                </span>
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
        {field.kind === "checkboxes" && (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <span className="grid h-4 w-4 place-items-center rounded border border-input">
                  <span className="h-2 w-2 rounded-sm bg-transparent" />
                </span>
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
