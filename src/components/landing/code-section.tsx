"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function CodeSection() {
  return (
    <section className="border-y bg-muted/20 py-20 md:py-28">
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
            Type-safe by default
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Validation, baked in.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-balance text-muted-foreground md:text-lg"
          >
            Every form generates a Zod schema at runtime. Your data is clean
            before it ever reaches your backend.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-xl border bg-card shadow-sm lg:col-span-3"
          >
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="rounded bg-background px-1.5 py-0.5 text-foreground shadow-sm">
                  schema.ts
                </span>
              </div>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed md:text-sm">
              <code>
                <Line>
                  <K>{"import"}</K>{" "}
                  <span className="text-foreground">{"{ z }"}</span>{" "}
                  <K>{"from"}</K>{" "}
                  <span className="text-foreground">{`"zod"`}</span>;
                </Line>
                <Line> </Line>
                <Line>
                  <K>{"export const"}</K>{" "}
                  <span className="text-foreground">{"FormSchema"}</span> ={" "}
                  <span className="text-foreground">{"z.object"}</span>(
                  {"{"}
                </Line>
                <Line>
                  {"  "}
                  <span className="text-foreground">{"name"}</span>:{" "}
                  <span className="text-foreground">{"z.string()"}</span>
                  {"\n      "}.min(
                  <span className="text-foreground">2</span>,{" "}
                  <span className="text-foreground">
                    {`"Name must be at least 2 chars"`}
                  </span>
                  ){"\n      "}.max(
                  <span className="text-foreground">50</span>),
                </Line>
                <Line>
                  {"  "}
                  <span className="text-foreground">{"email"}</span>:{" "}
                  <span className="text-foreground">{"z.string()"}</span>
                  .email(),
                </Line>
                <Line>
                  {"  "}
                  <span className="text-foreground">{"rating"}</span>:{" "}
                  <span className="text-foreground">{"z.number()"}</span>
                  .min(<span className="text-foreground">1</span>).max(
                  <span className="text-foreground">5</span>),
                </Line>
                <Line>
                  {"  "}
                  <span className="text-foreground">{"comments"}</span>:{" "}
                  <span className="text-foreground">{"z.string()"}</span>
                  .max(<span className="text-foreground">1000</span>).optional(),
                </Line>
                <Line>
                  {"})"};{"\n\n"}
                  <K>{"export type"}</K>{" "}
                  <span className="text-foreground">{"FormInput"}</span> ={" "}
                  <span className="text-foreground">{"z.infer"}</span>
                  {"<"}
                  <K>{"typeof"}</K>{" "}
                  <span className="text-foreground">{"FormSchema"}</span>
                  {">"};{"\n"}
                </Line>
              </code>
            </pre>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.2 },
              },
            }}
            className="space-y-3 lg:col-span-2"
          >
            <CodeFeature
              title="Runtime validation"
              desc="Bad data is rejected at the edge, before it ever touches your database."
            />
            <CodeFeature
              title="TypeScript inference"
              desc="Auto-generated types for your backend. Zero manual type definitions."
            />
            <CodeFeature
              title="Field-level constraints"
              desc="Min/max length, regex, required/optional, custom validators."
            />
            <CodeFeature
              title="Composable schemas"
              desc="Conditional logic, dependent fields, dynamic forms. All without rewrites."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function K({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-600 dark:text-blue-400">{children}</span>;
}

function Line({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function CodeFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground/10 text-foreground">
          <Check className="h-3 w-3" aria-hidden="true" />
        </span>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}
