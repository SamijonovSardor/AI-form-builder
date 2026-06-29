"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useUIStore } from "@/store/useUIStore";
import { FormRenderer, type AnswerMap, type AnswerValue } from "@/components/form-renderer/form-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PreviewPane() {
  const fields = useBuilderStore((s) => s.fields);
  const title = useBuilderStore((s) => s.title);
  const description = useBuilderStore((s) => s.description);
  const previewMode = useUIStore((s) => s.previewMode);
  const setPreviewMode = useUIStore((s) => s.setPreviewMode);

  const fieldIdsKey = fields.map((f) => f.id).join("|");

  const [values, setValues] = useState<AnswerMap>({});

  function onChange(id: string, value: AnswerValue) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  const isMobile = previewMode === "mobile";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center gap-1 rounded-md border bg-muted/30 p-0.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 px-2", !isMobile && "bg-background shadow-sm")}
            onClick={() => setPreviewMode("desktop")}
          >
            <Monitor className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 px-2", isMobile && "bg-background shadow-sm")}
            onClick={() => setPreviewMode("mobile")}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 p-4" key={fieldIdsKey}>
        <motion.div
          key={previewMode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className={cn(
            "mx-auto rounded-xl border bg-background p-6 shadow-sm",
            isMobile ? "max-w-sm" : "max-w-2xl",
          )}
        >
          <FormRenderer
            title={title}
            description={description}
            fields={fields}
            values={values}
            onChange={onChange}
            hideSubmit
          />
        </motion.div>
      </div>
    </div>
  );
}
