"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import type { FormField, FieldType } from "@/types/form";
import { useBuilderStore } from "@/store/useBuilderStore";
import { FIELD_TYPE_LABELS } from "@/types/form";

const SUPPORTS_OPTIONS: FieldType[] = ["select", "radio", "checkbox"];

export function FieldEditor() {
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const fields = useBuilderStore((s) => s.fields);
  const updateField = useBuilderStore((s) => s.updateField);
  const removeField = useBuilderStore((s) => s.removeField);

  const field = fields.find((f) => f.id === selectedFieldId) ?? null;

  if (!field) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">No field selected</p>
          <p className="mt-1">Pick a field from the list to edit its settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-5">
      <div>
        <h3 className="text-sm font-semibold">Field settings</h3>
        <p className="text-xs text-muted-foreground">
          Type: {FIELD_TYPE_LABELS[field.type]}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
      </div>

      {(field.type === "text" ||
        field.type === "email" ||
        field.type === "number" ||
        field.type === "textarea") && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          />
        </div>
      )}

      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label htmlFor="field-required" className="text-sm">
            Required
          </Label>
          <p className="text-xs text-muted-foreground">
            Responders must fill this in.
          </p>
        </div>
        <Switch
          id="field-required"
          checked={field.required}
          onCheckedChange={(v) => updateField(field.id, { required: v })}
        />
      </div>

      {SUPPORTS_OPTIONS.includes(field.type) && (
        <>
          <Separator />
          <OptionsEditor field={field} />
        </>
      )}

      {field.type === "rating" && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rating-min">Min</Label>
              <Input
                id="rating-min"
                type="number"
                min={1}
                value={field.minRating ?? 1}
                onChange={(e) =>
                  updateField(field.id, { minRating: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating-max">Max</Label>
              <Input
                id="rating-max"
                type="number"
                min={1}
                value={field.maxRating ?? 5}
                onChange={(e) =>
                  updateField(field.id, { maxRating: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </>
      )}

      <Separator />
      <Button
        variant="outline"
        className="w-full text-destructive hover:bg-destructive/10"
        onClick={() => removeField(field.id)}
      >
        <X className="h-4 w-4" />
        Delete field
      </Button>
    </div>
  );
}

function OptionsEditor({ field }: { field: FormField }) {
  const updateField = useBuilderStore((s) => s.updateField);
  const options = field.options ?? [];

  function setOptions(next: string[]) {
    updateField(field.id, { options: next });
  }

  return (
    <div className="space-y-2">
      <Label>Options</Label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={opt}
              onChange={(e) => {
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
              disabled={options.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOptions([...options, `Option ${options.length + 1}`])}
      >
        <Plus className="h-4 w-4" />
        Add option
      </Button>
    </div>
  );
}
