import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FileText className="h-5 w-5" aria-hidden="true" />
              <span>FormForge AI</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-powered form builder for modern teams. Built as a portfolio
              piece, polished for production.
            </p>

            <div className="mt-6 max-w-sm">
              <p className="text-sm font-medium">Get product updates</p>
              <form className="mt-3 flex gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-9"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#showcase" },
              { label: "Sign up", href: "/signup" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: "Documentation", href: "#" },
              { label: "Templates", href: "#" },
              { label: "Changelog", href: "#" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Contact", href: "#" },
              { label: "GitHub", href: "#" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            &copy; {new Date().getFullYear()} FormForge AI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <span className="hidden sm:inline">
              Built with Next.js, Appwrite, and Zod.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
