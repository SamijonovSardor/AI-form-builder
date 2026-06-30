"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function Testimonial() {
  return (
    <section className="border-y py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Loved by makers
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mt-8"
        >
          <Quote
            className="absolute -left-2 -top-4 h-10 w-10 text-blue-500/25"
            aria-hidden="true"
          />
          <blockquote className="text-balance text-2xl font-medium leading-tight tracking-tight md:text-3xl lg:text-4xl">
            &ldquo;We shipped our customer feedback form in under five minutes.
            The AI picked the right field types and validation on the first try
            — no manual tweaking needed.&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
              SC
            </div>
            <div>
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-sm text-muted-foreground">
                Head of Product, Northwind
              </div>
            </div>
          </figcaption>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <Logo name="Acme Corp" />
          <Logo name="Northwind" />
          <Logo name="Globex" />
          <Logo name="Initech" />
        </motion.div>
      </div>
    </section>
  );
}

function Logo({ name }: { name: string }) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg border bg-card text-sm font-semibold tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground">
      {name}
    </div>
  );
}
