"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Eye, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useUIStore } from "@/store/useUIStore";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { FieldList } from "@/components/builder/field-list";
import { FieldEditor } from "@/components/builder/field-editor";
import { AddFieldMenu } from "@/components/builder/add-field-menu";
import { PreviewPane } from "@/components/builder/preview-pane";
import { getForm, updateForm, createForm } from "@/lib/appwrite/db";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import type { FieldType } from "@/types/form";
import { toast } from "sonner";

export default function BuilderPage() {
  const params = useParams<{ formId: string }>();
  const router = useRouter();
  const { user, ready } = useRequireAuth();
  const isNew = params.formId === "new";

  const formId = useBuilderStore((s) => s.formId);
  const title = useBuilderStore((s) => s.title);
  const description = useBuilderStore((s) => s.description);
  const fields = useBuilderStore((s) => s.fields);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const addField = useBuilderStore((s) => s.addField);
  const setTitle = useBuilderStore((s) => s.setTitle);
  const setDescription = useBuilderStore((s) => s.setDescription);
  const loadForm = useBuilderStore((s) => s.loadForm);
  const reset = useBuilderStore((s) => s.reset);

  const mobileTab = useUIStore((s) => s.mobileTab);
  const setMobileTab = useUIStore((s) => s.setMobileTab);
  const isSaving = useUIStore((s) => s.isSaving);
  const setSaving = useUIStore((s) => s.setSaving);

  const [savedFormId, setSavedFormId] = useState<string | null>(
    isNew ? null : (params.formId as string),
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !ready || !user) return;
    if (formId === params.formId) {
      return;
    }
    let cancelled = false;
    getForm(params.formId as string)
      .then((form) => {
        if (cancelled) return;
        loadForm({
          formId: form.$id,
          title: form.title,
          description: form.description,
          fields: form.fields,
        });
        setSavedFormId(form.$id);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Could not load form");
        toast.error("Could not load form");
        router.replace("/dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, [isNew, ready, user, params.formId, formId, loadForm, router]);

  useEffect(() => {
    if (isNew) {
      reset();
    }
  }, [isNew, reset]);

  const isLoading = !isNew && formId !== params.formId && !loadError;

  useEffect(() => {
    if (isNew) reset();
  }, [isNew, reset]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (savedFormId) {
        const updated = await updateForm(savedFormId, user.$id, {
          title,
          description,
          fields,
        });
        useBuilderStore.setState({ isDirty: false });
        toast.success("Saved");
        if (updated.$id !== params.formId) {
          router.replace(`/dashboard/${updated.$id}`);
        }
      } else {
        const created = await createForm(user.$id, { title, description, fields });
        setSavedFormId(created.$id);
        useBuilderStore.setState({ formId: created.$id, isDirty: false });
        router.replace(`/dashboard/${created.$id}`);
        toast.success("Form created");
      }
    } catch (err) {
      toast.error(describeAppwriteError(err));
    } finally {
      setSaving(false);
    }
  }, [user, savedFormId, title, description, fields, setSaving, router, params.formId]);

  async function handlePublishToggle() {
    if (!user) return;
    if (!savedFormId) {
      await handleSave();
      return;
    }
    const current = useBuilderStore.getState();
    const next = current.title ? "published" : "draft";
    try {
      setSaving(true);
      await updateForm(savedFormId, user.$id, {
        title: current.title,
        description: current.description,
        fields: current.fields,
        status: next,
      });
      toast.success(next === "published" ? "Form published" : "Form unpublished");
    } catch (err) {
      toast.error(describeAppwriteError(err));
    } finally {
      setSaving(false);
    }
  }

  if (!ready || isLoading) {
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
            {isDirty && <span className="ml-1 text-amber-500">&middot;</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {savedFormId && (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/${savedFormId}/responses`}>
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Responses</span>
              </Link>
            </Button>
          )}
          {savedFormId && (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/f/${savedFormId}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Open</span>
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
          <Button
            onClick={handlePublishToggle}
            disabled={isSaving}
            variant={savedFormId ? "outline" : "default"}
            size="sm"
          >
            <Eye className="h-4 w-4" />
            {savedFormId ? "Publish" : "Save & publish"}
          </Button>
        </div>
      </header>

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
        <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as "edit" | "preview")} className="flex h-full flex-col">
          <div className="border-b p-2">
            <TabsList className="w-full">
              <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="edit" className="mt-0 flex-1 overflow-auto">
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
          </TabsContent>
          <TabsContent value="preview" className="mt-0 flex-1 overflow-hidden">
            <PreviewPane />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
