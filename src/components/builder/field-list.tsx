"use client";

import { useEffect, useState } from "react";
import { GripVertical, Trash2, Type, AtSign, Hash, AlignLeft, ChevronDown, Circle, CheckSquare, Star, Upload, Calendar } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { cn } from "@/lib/utils";
import type { FieldType } from "@/types/form";

const CARD_HEIGHT = 72;
const GAP = 12;
const ROW_HEIGHT = CARD_HEIGHT + GAP;

const ICONS: Record<FieldType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  email: <AtSign className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  select: <ChevronDown className="h-4 w-4" />,
  radio: <Circle className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  rating: <Star className="h-4 w-4" />,
  file: <Upload className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
};

interface DragState {
  id: string;
  initialSlotY: number;
  initialCursorY: number;
  currentY: number;
}

export function FieldList() {
  const fields = useBuilderStore((s) => s.fields);
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const selectField = useBuilderStore((s) => s.selectField);
  const removeField = useBuilderStore((s) => s.removeField);

  const [drag, setDrag] = useState<DragState | null>(null);

  useEffect(() => {
    if (!drag) return;

    function onMove(e: PointerEvent) {
      if (!drag) return;
      const { fields: currentFields, reorderFields } = useBuilderStore.getState();
      const visualY = drag.initialSlotY + (e.clientY - drag.initialCursorY);
      const center = visualY + CARD_HEIGHT / 2;
      let targetIndex = Math.round(center / ROW_HEIGHT);
      targetIndex = Math.max(0, Math.min(currentFields.length - 1, targetIndex));
      const currentIndex = currentFields.findIndex((f) => f.id === drag.id);
      if (targetIndex !== currentIndex) {
        reorderFields(currentIndex, targetIndex);
      }
      setDrag((prev) => (prev ? { ...prev, currentY: e.clientY } : prev));
    }

    function onUp() {
      setDrag(null);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [drag?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePointerDown(
    e: React.PointerEvent,
    fieldId: string,
    index: number,
  ) {
    if (!(e.target as HTMLElement).closest("[data-drag-handle]")) return;
    e.preventDefault();
    setDrag({
      id: fieldId,
      initialSlotY: index * ROW_HEIGHT,
      initialCursorY: e.clientY,
      currentY: e.clientY,
    });
  }

  if (fields.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">No fields yet</p>
          <p className="mt-1">Add a field from the panel below, or generate one with AI.</p>
        </div>
      </div>
    );
  }

  const draggedField = drag ? fields.find((f) => f.id === drag.id) : null;
  const draggedIndex = drag ? fields.findIndex((f) => f.id === drag.id) : -1;
  const dragVisualY = drag
    ? drag.initialSlotY + (drag.currentY - drag.initialCursorY)
    : 0;

  return (
    <div
      className="relative"
      style={{ height: fields.length * ROW_HEIGHT - GAP }}
    >
      {fields.map((field, i) => {
        const isDragging = drag?.id === field.id;
        const slotY = i * ROW_HEIGHT;
        const visualY = isDragging ? dragVisualY : slotY;

        return (
          <div
            key={field.id}
            style={{
              transform: `translateY(${visualY}px)${isDragging ? " scale(1.015)" : ""}`,
              transition: isDragging
                ? "none"
                : "transform 320ms cubic-bezier(.4,0,.2,1)",
              opacity: isDragging ? 0 : 1,
            }}
            className={cn(
              "group absolute left-0 right-0 top-0 flex h-[72px] items-center gap-3 rounded-2xl border bg-card px-3.5",
              selectedFieldId === field.id
                ? "border-primary shadow-sm ring-1 ring-primary/30"
                : "border-border",
            )}
          >
            <button
              type="button"
              data-drag-handle
              onPointerDown={(e) => handlePointerDown(e, field.id, i)}
              className="flex h-10 w-[22px] cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-white/5 hover:text-muted-foreground active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
              {ICONS[field.type]}
            </div>
            <button
              type="button"
              onClick={() => selectField(field.id)}
              className="min-w-0 flex-1 cursor-pointer overflow-hidden text-left"
              aria-label={`Select ${field.label}`}
            >
              <p className="truncate text-[14.5px] font-semibold">
                <span>{i + 1}.</span> {field.label}
              </p>
              <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                <span>{field.type}</span>
                <span className="mx-1.5 text-muted-foreground/50">·</span>
                {field.required ? (
                  <span className="text-red-400">required</span>
                ) : (
                  <span>optional</span>
                )}
              </p>
            </button>
            <button
              type="button"
              onClick={() => removeField(field.id)}
              className="rounded-md p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              aria-label="Delete field"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {draggedField && draggedIndex >= 0 && (
        <div
          style={{
            transform: `translateY(${dragVisualY}px) scale(1.015)`,
            zIndex: 50,
            transition: "none",
          }}
          className="pointer-events-none absolute left-0 right-0 top-0 flex h-[72px] items-center gap-3 rounded-2xl border border-white/10 bg-muted/60 px-3.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.55)]"
        >
          <div className="flex h-10 w-[22px] items-center justify-center text-muted-foreground/70">
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
            {ICONS[draggedField.type]}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-[14.5px] font-semibold">
              <span>{draggedIndex + 1}.</span> {draggedField.label}
            </p>
            <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
              <span>{draggedField.type}</span>
              <span className="mx-1.5 text-muted-foreground/50">·</span>
              {draggedField.required ? (
                <span className="text-red-400">required</span>
              ) : (
                <span>optional</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
