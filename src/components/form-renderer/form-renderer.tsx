"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormField } from "@/types/form";

export type AnswerValue = string | string[] | number | null;

export interface AnswerMap {
  [fieldId: string]: AnswerValue;
}

interface FormRendererProps {
  title: string;
  description?: string;
  fields: FormField[];
  values: AnswerMap;
  onChange: (fieldId: string, value: AnswerValue) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
  submitting?: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  hideSubmit?: boolean;
}

export function FormRenderer({
  title,
  description,
  fields,
  values,
  onChange,
  disabled,
  errors,
  submitting,
  onSubmit,
  submitLabel = "Submit",
  hideSubmit,
}: FormRendererProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title || "Untitled form"}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="space-y-5">
        {fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={values[field.id] ?? null}
            onChange={(v) => onChange(field.id, v)}
            error={errors?.[field.id]}
            disabled={disabled}
          />
        ))}
        {fields.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No fields yet. Add one from the builder to get started.
          </p>
        )}
      </div>

      {!hideSubmit && fields.length > 0 && (
        <button
          type="submit"
          disabled={disabled || submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : submitLabel}
        </button>
      )}
    </form>
  );
}

interface FieldInputProps {
  field: FormField;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
  disabled?: boolean;
}

function FieldInput({ field, value, onChange, error, disabled }: FieldInputProps) {
  const label = (
    <Label className="flex items-center gap-1">
      {field.label}
      {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  return (
    <div className="space-y-2">
      {label}

      {field.type === "text" && (
        <Input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      )}

      {field.type === "email" && (
        <Input
          type="email"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "you@example.com"}
          disabled={disabled}
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          value={value === null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
          rows={4}
        />
      )}

      {field.type === "date" && (
        <Input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {field.type === "select" && (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Choose...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === "radio" && (
        <div className="space-y-2">
          {(field.options ?? []).map((opt) => {
            const id = `${field.id}-${opt}`;
            return (
              <label
                key={opt}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  id={id}
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={(value as string) === opt}
                  onChange={() => onChange(opt)}
                  disabled={disabled}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="space-y-2">
          {(field.options ?? []).map((opt) => {
            const id = `${field.id}-${opt}`;
            const current = (value as string[]) ?? [];
            const checked = current.includes(opt);
            return (
              <label
                key={opt}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  id={id}
                  type="checkbox"
                  value={opt}
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...current, opt]);
                    } else {
                      onChange(current.filter((v) => v !== opt));
                    }
                  }}
                  disabled={disabled}
                  className="h-4 w-4 rounded accent-primary"
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {field.type === "rating" && (
        <RatingInput
          value={typeof value === "number" ? value : null}
          onChange={onChange}
          min={field.minRating ?? 1}
          max={field.maxRating ?? 5}
          disabled={disabled}
        />
      )}

      {field.type === "file" && (
        <FileInput
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RatingInput({
  value,
  onChange,
  min,
  max,
  disabled,
}: {
  value: number | null;
  onChange: (v: AnswerValue) => void;
  min: number;
  max: number;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const display = hover ?? value ?? 0;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {items.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          disabled={disabled}
          className={cn(
            "p-1 text-2xl transition-transform",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110",
          )}
          aria-label={`Rate ${n} of ${max}`}
        >
          {display >= n ? (
            <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
          ) : (
            <Star className="h-7 w-7 text-muted-foreground/40" />
          )}
        </button>
      ))}
    </div>
  );
}

function FileInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FormField;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  disabled?: boolean;
}) {
  const inputId = `file-${field.id}`;
  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center justify-center rounded-md border border-dashed bg-muted/30 px-4 py-6 text-sm text-muted-foreground transition hover:bg-muted/50"
      >
        <input
          id={inputId}
          type="file"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onChange(f ? f.name : null);
          }}
          className="sr-only"
        />
        {value ? (
          <span className="inline-flex items-center gap-2 text-foreground">
            <Check className="h-4 w-4 text-emerald-500" /> {String(value)}
          </span>
        ) : (
          <span>Click to upload a file</span>
        )}
      </label>
    </div>
  );
}
