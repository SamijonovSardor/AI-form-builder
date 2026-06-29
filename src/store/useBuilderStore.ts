"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import type { FieldType, FormField } from "@/types/form";

export interface BuilderState {
  formId: string | null;
  title: string;
  description: string;
  fields: FormField[];
  selectedFieldId: string | null;
  isDirty: boolean;

  addField: (type: FieldType, atIndex?: number) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  loadFromAI: (input: {
    title: string;
    description?: string;
    fields: FormField[];
  }) => void;
  loadForm: (input: {
    formId: string;
    title: string;
    description?: string;
    fields: FormField[];
  }) => void;
  reset: () => void;
}

const DEFAULT_LABELS: Record<FieldType, string> = {
  text: "Untitled question",
  email: "What's your email?",
  number: "Enter a number",
  textarea: "Tell us more",
  select: "Choose an option",
  radio: "Pick one",
  checkbox: "Select all that apply",
  rating: "How would you rate this?",
  file: "Upload a file",
  date: "Pick a date",
};

function makeField(type: FieldType): FormField {
  const base: FormField = {
    id: nanoid(8),
    type,
    label: DEFAULT_LABELS[type],
    required: false,
  };
  if (type === "select" || type === "radio" || type === "checkbox") {
    base.options = ["Option 1", "Option 2"];
  }
  if (type === "rating") {
    base.minRating = 1;
    base.maxRating = 5;
  }
  return base;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  formId: null,
  title: "Untitled form",
  description: "",
  fields: [],
  selectedFieldId: null,
  isDirty: false,

  addField: (type, atIndex) =>
    set((s) => {
      const field = makeField(type);
      const fields = [...s.fields];
      if (typeof atIndex === "number") {
        fields.splice(atIndex, 0, field);
      } else {
        fields.push(field);
      }
      return { fields, selectedFieldId: field.id, isDirty: true };
    }),

  updateField: (id, patch) =>
    set((s) => ({
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      isDirty: true,
    })),

  removeField: (id) =>
    set((s) => ({
      fields: s.fields.filter((f) => f.id !== id),
      selectedFieldId: s.selectedFieldId === id ? null : s.selectedFieldId,
      isDirty: true,
    })),

  reorderFields: (fromIndex, toIndex) =>
    set((s) => {
      if (fromIndex === toIndex) return s;
      const fields = [...s.fields];
      const [moved] = fields.splice(fromIndex, 1);
      if (!moved) return s;
      fields.splice(toIndex, 0, moved);
      return { fields, isDirty: true };
    }),

  selectField: (id) => set({ selectedFieldId: id }),

  setTitle: (title) => set({ title, isDirty: true }),
  setDescription: (description) => set({ description, isDirty: true }),

  loadFromAI: (input) =>
    set(() => ({
      formId: null,
      title: input.title,
      description: input.description ?? "",
      fields: input.fields,
      selectedFieldId: input.fields[0]?.id ?? null,
      isDirty: true,
    })),

  loadForm: (input) =>
    set(() => ({
      formId: input.formId,
      title: input.title,
      description: input.description ?? "",
      fields: input.fields,
      selectedFieldId: null,
      isDirty: false,
    })),

  reset: () =>
    set({
      formId: null,
      title: "Untitled form",
      description: "",
      fields: [],
      selectedFieldId: null,
      isDirty: false,
    }),
}));
