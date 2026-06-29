"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  BarChart3,
  ExternalLink,
  Inbox,
  Download,
  Eye,
  X,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getForm, listResponses } from "@/lib/appwrite/db";
import { getFileViewUrl } from "@/lib/appwrite/storage";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import type { FormDoc, ResponseDoc } from "@/types/form";

export default function ResponsesPage() {
  const params = useParams<{ formId: string }>();
  const router = useRouter();
  const { ready } = useRequireAuth();
  const [form, setForm] = useState<FormDoc | null>(null);
  const [responses, setResponses] = useState<ResponseDoc[] | null>(null);
  const [selected, setSelected] = useState<ResponseDoc | null>(null);

  useEffect(() => {
    if (!ready || !params.formId) return;
    Promise.all([getForm(params.formId), listResponses(params.formId)])
      .then(([f, r]) => {
        setForm(f);
        setResponses(r);
      })
      .catch((err) => {
        toast.error(describeAppwriteError(err));
        router.replace("/dashboard");
      });
  }, [ready, params.formId, router]);

  if (!ready || !form || responses === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalResponses = responses.length;
  const fileCount = responses.reduce(
    (acc, r) => acc + Object.keys(r.fileIds ?? {}).length,
    0,
  );
  const lastResponseAt = responses[0]?.submittedAt;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">/</span>
          <Link
            href={`/dashboard/${form.$id}`}
            className="max-w-[200px] truncate text-sm font-medium hover:underline sm:max-w-md"
          >
            {form.title}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/${form.$id}`}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Edit form</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/f/${form.$id}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open public</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <BarChart3 className="h-5 w-5 text-primary" />
              Responses
            </h1>
            <p className="text-sm text-muted-foreground">
              Every submission to this form
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total responses"
            value={totalResponses}
            hint={totalResponses === 1 ? "response" : "responses"}
          />
          <StatCard
            label="Files uploaded"
            value={fileCount}
            hint={fileCount === 1 ? "file" : "files"}
          />
          <StatCard
            label="Last submission"
            value={lastResponseAt ? formatDateTime(lastResponseAt) : "—"}
            hint={lastResponseAt ? "" : "No submissions yet"}
            small
          />
        </div>

        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <ResponseTable
              form={form}
              responses={responses}
              onSelect={setSelected}
            />
          </TabsContent>

          <TabsContent value="cards" className="mt-4">
            <ResponseCards
              form={form}
              responses={responses}
              onSelect={setSelected}
            />
          </TabsContent>
        </Tabs>
      </main>

      <ResponseDetailDialog
        form={form}
        response={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  small,
}: {
  label: string;
  value: number | string;
  hint?: string;
  small?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={small ? "text-xl font-semibold" : "text-3xl font-semibold tracking-tight"}>
          {value}
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function ResponseTable({
  form,
  responses,
  onSelect,
}: {
  form: FormDoc;
  responses: ResponseDoc[];
  onSelect: (r: ResponseDoc) => void;
}) {
  if (responses.length === 0) {
    return <EmptyState />;
  }
  const previewFields = form.fields.slice(0, 3);
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              {previewFields.map((f) => (
                <th key={f.id} className="px-4 py-3 font-medium">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Files</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {responses.map((r, i) => (
              <tr
                key={r.$id}
                className="cursor-pointer border-b transition last:border-0 hover:bg-muted/30"
                onClick={() => onSelect(r)}
              >
                <td className="px-4 py-3 text-muted-foreground">{responses.length - i}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateTime(r.submittedAt)}
                </td>
                {previewFields.map((f) => (
                  <td key={f.id} className="max-w-[200px] truncate px-4 py-3">
                    {renderPreview(r.answers[f.id])}
                  </td>
                ))}
                <td className="px-4 py-3 text-muted-foreground">
                  {Object.keys(r.fileIds ?? {}).length > 0
                    ? `${Object.keys(r.fileIds ?? {}).length} file(s)`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ResponseCards({
  form,
  responses,
  onSelect,
}: {
  form: FormDoc;
  responses: ResponseDoc[];
  onSelect: (r: ResponseDoc) => void;
}) {
  if (responses.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {responses.map((r, i) => (
        <motion.button
          key={r.$id}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          onClick={() => onSelect(r)}
          className="group rounded-xl border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateTime(r.submittedAt)}
            </span>
            <span>#{responses.length - i}</span>
          </div>
          <div className="mt-3 space-y-1">
            {form.fields.slice(0, 2).map((f) => (
              <div key={f.id} className="truncate text-sm">
                <span className="text-muted-foreground">{f.label}: </span>
                <span className="font-medium">{renderPreview(r.answers[f.id])}</span>
              </div>
            ))}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-semibold">No responses yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Once someone submits this form, you&apos;ll see their answers here. Share the public link to start collecting responses.
        </p>
      </CardContent>
    </Card>
  );
}

function ResponseDetailDialog({
  form,
  response,
  onClose,
}: {
  form: FormDoc;
  response: ResponseDoc | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-xl border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Response detail</h2>
                <p className="text-xs text-muted-foreground">
                  Submitted {formatDateTime(response.submittedAt)}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {form.fields.map((field) => {
                const value = response.answers[field.id];
                const fileId = response.fileIds?.[field.id];
                return (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </p>
                    {value === undefined || value === null || value === "" ||
                    (Array.isArray(value) && value.length === 0) ? (
                      <p className="text-sm italic text-muted-foreground">
                        (empty)
                      </p>
                    ) : (
                      <div className="text-sm">
                        {Array.isArray(value) ? (
                          <ul className="list-inside list-disc space-y-0.5">
                            {value.map((v) => (
                              <li key={v}>{String(v)}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{String(value)}</p>
                        )}
                        {fileId && (
                          <a
                            href={getFileViewUrl(fileId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                          >
                            <Download className="h-3 w-3" />
                            Download file
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function renderPreview(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value.join(", ");
  }
  const s = String(value);
  return s.length > 50 ? `${s.slice(0, 50)}…` : s;
}
