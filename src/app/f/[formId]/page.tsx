"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getForm, createResponse } from "@/lib/appwrite/db";
import { uploadFile } from "@/lib/appwrite/storage";
import { buildZodSchema } from "@/lib/zod/buildSchema";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import { FormRenderer, type AnswerMap, type AnswerValue } from "@/components/form-renderer/form-renderer";
import { toast } from "sonner";
import type { FormDoc } from "@/types/form";

export default function PublicFormPage() {
  const params = useParams<{ formId: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [values, setValues] = useState<AnswerMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!params.formId) return;
    getForm(params.formId)
      .then((f) => {
        if (f.status !== "published") {
          setLoadError("This form is not currently accepting responses.");
        } else {
          setForm(f);
          const initial: AnswerMap = {};
          for (const field of f.fields) {
            initial[field.id] = field.type === "checkbox" ? [] : null;
          }
          setValues(initial);
        }
      })
      .catch((err) => {
        setLoadError(describeAppwriteError(err));
      })
      .finally(() => setLoading(false));
  }, [params.formId]);

  function onChange(fieldId: string, value: AnswerValue) {
    setValues((v) => ({ ...v, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[fieldId];
        return next;
      });
    }
  }

  async function onSubmit() {
    if (!form) return;
    const schema = buildZodSchema(form.fields);
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = typeof issue.path[0] === "string" ? issue.path[0] : null;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const fileIds: Record<string, string> = {};
      for (const field of form.fields) {
        if (field.type !== "file") continue;
        const v = values[field.id];
        if (v instanceof File) {
          fileIds[field.id] = await uploadFile(v);
        }
      }

      const answers: Record<string, string | string[] | number | null> = {};
      for (const [key, value] of Object.entries(result.data)) {
        if (value instanceof File) {
          answers[key] = value.name;
        } else if (Array.isArray(value)) {
          answers[key] = value as string[];
        } else {
          answers[key] = value as string | number | null;
        }
      }

      await createResponse(
        form.$id,
        answers,
        Object.keys(fileIds).length > 0 ? fileIds : undefined,
      );
      router.push(`/f/${form.$id}/success`);
    } catch (err) {
      toast.error(describeAppwriteError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Form unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loadError ?? "This form doesn't exist or has been removed."}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-6">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4" />
            FormForge AI
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <FormRenderer
            title={form.title}
            description={form.description}
            fields={form.fields}
            values={values}
            onChange={onChange}
            errors={errors}
            submitting={submitting}
            onSubmit={onSubmit}
          />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by FormForge AI
        </p>
      </main>
    </div>
  );
}
