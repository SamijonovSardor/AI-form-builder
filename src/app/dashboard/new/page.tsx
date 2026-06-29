"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useUIStore } from "@/store/useUIStore";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { FieldList } from "@/components/builder/field-list";
import { FieldEditor } from "@/components/builder/field-editor";
import { AddFieldMenu } from "@/components/builder/add-field-menu";
import { PreviewPane } from "@/components/builder/preview-pane";
import { createForm } from "@/lib/appwrite/db";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import type { FieldType } from "@/types/form";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "A job application form for a senior frontend engineer with name, email, years of experience, portfolio URL, and a short bio",
  "A customer feedback survey for a coffee shop: visit date, drink ordered (dropdown), rating, what they liked, what to improve",
  "An event RSVP form: name, email, number of guests, dietary restrictions (checkboxes), and a comments field",
  "A bug report form: short summary, severity (radio), steps to reproduce (textarea), screenshot upload",
];

export default function NewFormPage() {
  const router = useRouter();
  const { user, ready } = useRequireAuth();
  const mobileTab = useUIStore((s) => s.mobileTab);
  const setMobileTab = useUIStore((s) => s.setMobileTab);
  const isSaving = useUIStore((s) => s.isSaving);
  const setSaving = useUIStore((s) => s.setSaving);

  const title = useBuilderStore((s) => s.title);
  const description = useBuilderStore((s) => s.description);
  const fields = useBuilderStore((s) => s.fields);
  const addField = useBuilderStore((s) => s.addField);
  const setTitle = useBuilderStore((s) => s.setTitle);
  const setDescription = useBuilderStore((s) => s.setDescription);
  const reset = useBuilderStore((s) => s.reset);

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<"prompt" | "editor">("prompt");

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please describe your form first");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Generation failed");
      }
      const data = (await res.json()) as {
        title: string;
        description?: string;
        fields: import("@/types/form").FormField[];
      };
      reset();
      useBuilderStore.getState().loadFromAI({
        title: data.title,
        description: data.description,
        fields: data.fields,
      });
      setMode("editor");
      toast.success("Form generated — feel free to edit");
    } catch (err) {
      toast.error(describeAppwriteError(err));
    } finally {
      setGenerating(false);
    }
  }

  function handleBlank() {
    reset();
    setMode("editor");
  }

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) {
      toast.error("Form needs a title");
      return;
    }
    setSaving(true);
    try {
      const created = await createForm(user.$id, {
        title,
        description,
        fields,
      });
      useBuilderStore.setState({ formId: created.$id, isDirty: false });
      router.push(`/dashboard/${created.$id}`);
    } catch (err) {
      toast.error(describeAppwriteError(err));
    } finally {
      setSaving(false);
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
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="max-w-[200px] truncate text-sm font-medium sm:max-w-md">
            {title || "Untitled form"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mode === "editor" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setMode("prompt");
                setPrompt("");
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Start over</span>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving || mode === "prompt"} size="sm">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {mode === "prompt" ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-auto"
          >
            <div className="mx-auto w-full max-w-3xl px-4 py-10">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Create a new form
                  </CardTitle>
                  <CardDescription>
                    Describe the form you want and the AI will generate a complete draft in
                    seconds. You can edit everything afterwards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A job application form for a senior frontend engineer..."
                    rows={5}
                    disabled={generating}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Try:</span>
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setPrompt(ex)}
                        disabled={generating}
                        className="rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        {ex.length > 60 ? ex.slice(0, 60) + "..." : ex}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={handleGenerate} disabled={generating} className="flex-1">
                      {generating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {generating ? "Generating..." : "Generate with AI"}
                    </Button>
                    <Button onClick={handleBlank} variant="outline" disabled={generating}>
                      Start from blank
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI generation requires an LLM API key in{" "}
                    <code className="rounded bg-muted px-1">.env.local</code> (LLM_PROVIDER and
                    LLM_API_KEY).
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="hidden flex-1 overflow-hidden md:grid md:grid-cols-[320px_1fr_420px]">
              <div className="flex h-full flex-col border-r">
                <div className="space-y-2 border-b p-4">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Form title"
                    className="border-0 px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description (optional)"
                    rows={2}
                    className="resize-none border-0 px-0 text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex-1 overflow-auto p-3">
                  <FieldList />
                </div>
                <div className="border-t p-3">
                  <AddFieldMenu onAdd={(t) => addField(t as FieldType)} />
                </div>
              </div>
              <div className="h-full overflow-hidden border-r">
                <PreviewPane />
              </div>
              <div className="h-full overflow-auto">
                <FieldEditor />
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden md:hidden">
              <div className="flex border-b p-2">
                <div className="flex w-full rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setMobileTab("edit")}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1 text-sm font-medium transition",
                      mobileTab === "edit" ? "bg-background shadow" : "text-muted-foreground",
                    )}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab("preview")}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1 text-sm font-medium transition",
                      mobileTab === "preview" ? "bg-background shadow" : "text-muted-foreground",
                    )}
                  >
                    Preview
                  </button>
                </div>
              </div>
              {mobileTab === "edit" ? (
                <div className="flex-1 overflow-auto">
                  <div className="space-y-2 border-b p-4">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Form title"
                      className="border-0 px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description (optional)"
                      rows={2}
                      className="resize-none border-0 px-0 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-3">
                    <FieldList />
                  </div>
                  <div className="border-t p-3">
                    <AddFieldMenu onAdd={(t) => addField(t as FieldType)} />
                  </div>
                  <div className="border-t">
                    <FieldEditor />
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <PreviewPane />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
