"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Copy, Trash2, ExternalLink, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SiteHeader } from "@/components/site-header";
import {
  listForms,
  deleteForm,
  duplicateForm,
} from "@/lib/appwrite/db";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import type { FormDoc } from "@/types/form";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, ready } = useRequireAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormDoc[] | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    listForms(user.$id)
      .then(setForms)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load forms");
        setForms([]);
      });
  }, [ready, user]);

  async function handleDelete(form: FormDoc) {
    if (!confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    try {
      await deleteForm(form.$id);
      setForms((curr) => (curr ?? []).filter((f) => f.$id !== form.$id));
      toast.success("Form deleted");
    } catch (err) {
      toast.error(describeAppwriteError(err));
    }
  }

  async function handleDuplicate(form: FormDoc) {
    if (!user) return;
    try {
      const dup = await duplicateForm(user.$id, form);
      setForms((curr) => [dup, ...(curr ?? [])]);
      toast.success("Form duplicated");
    } catch (err) {
      toast.error(describeAppwriteError(err));
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your forms</h1>
            <p className="text-sm text-muted-foreground">
              Build, edit, and share forms. {forms?.length ?? 0} total.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" />
              New form
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {forms === null ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <EmptyState onCreate={() => router.push("/dashboard/new")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <Card key={form.$id} className="group relative">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/dashboard/${form.$id}`}
                        className="block min-w-0 flex-1"
                      >
                        <h3 className="truncate font-semibold">{form.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {form.description || `${form.fields.length} field${form.fields.length === 1 ? "" : "s"}`}
                        </p>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/${form.$id}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/${form.$id}/responses`)}>
                            View responses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(form)}>
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(`/f/${form.$id}`, "_blank", "noopener")
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open public link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(form)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span
                        className={
                          form.status === "published"
                            ? "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400"
                            : "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400"
                        }
                      >
                        {form.status}
                      </span>
                      <span>Updated {formatDateTime(form.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      <h3 className="font-semibold">No forms yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first form — describe what you need and the AI will build it
        for you, or start from a blank canvas.
      </p>
      <Button onClick={onCreate} className="mt-6">
        <Plus className="h-4 w-4" />
        Create your first form
      </Button>
    </div>
  );
}
