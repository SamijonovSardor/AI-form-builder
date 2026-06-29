import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Sparkles, Wand2, MousePointerClick, Share2, BarChart3, Check } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered form builder
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
            Describe it. We build it.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground md:text-lg">
            FormForge AI turns a single sentence into a complete, shareable
            form. Edit visually, share with one link, collect responses
            instantly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">I have an account</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required. Sign up with email.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            <Feature
              icon={<Wand2 className="h-5 w-5" />}
              title="AI generation"
              desc="Type a sentence like &quot;a job application form&quot; and get a complete form ready in seconds."
            />
            <Feature
              icon={<MousePointerClick className="h-5 w-5" />}
              title="Drag & drop builder"
              desc="Reorder, edit, and configure every field. Live preview updates as you type."
            />
            <Feature
              icon={<Share2 className="h-5 w-5" />}
              title="Share anywhere"
              desc="Every form has a public link. Send it, embed it, or share it on social."
            />
            <Feature
              icon={<BarChart3 className="h-5 w-5" />}
              title="Response dashboard"
              desc="See every submission in a clean table, with stats that update in real time."
            />
            <Feature
              icon={<Check className="h-5 w-5" />}
              title="Validated by Zod"
              desc="Every input is validated with a runtime schema generated from your field config."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="Portfolio-grade"
              desc="Built on Next.js, Appwrite, Zustand, Tailwind, Radix, and Framer Motion."
            />
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to build your first form?
            </h2>
            <p className="mt-2 text-muted-foreground">
              It takes about ten seconds. We promise.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </section>

        <footer className="border-t">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} FormForge AI</span>
            <span>Built for demos, polished for production.</span>
          </div>
        </footer>
      </main>
    </>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-left shadow-sm">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
