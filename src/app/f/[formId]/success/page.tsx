"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getForm } from "@/lib/appwrite/db";
import { describeAppwriteError } from "@/lib/appwrite/errors";
import type { FormDoc } from "@/types/form";

export default function SuccessPage() {
  const params = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormDoc | null>(null);

  useEffect(() => {
    if (!params.formId) return;
    getForm(params.formId)
      .then(setForm)
      .catch((err) => console.error(describeAppwriteError(err)));
  }, [params.formId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-sm text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Check className="h-9 w-9 text-emerald-500" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Thank you!</h1>
        <p className="mt-2 text-muted-foreground">
          Your response to <span className="font-medium text-foreground">{form?.title ?? "this form"}</span> has been recorded.
        </p>

        <div className="mt-8 flex flex-col items-center gap-2">
          {form && (
            <Button asChild>
              <Link href={`/f/${form.$id}`}>Submit another response</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <FileText className="h-4 w-4" />
              Create your own form
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
