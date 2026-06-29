export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "rating"
  | "file"
  | "date";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  minRating?: number;
  maxRating?: number;
}

export type FormStatus = "draft" | "published";

export interface FormDoc {
  $id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: FormStatus;
  fields: FormField[];
  theme?: { primaryColor?: string };
  createdAt: string;
  updatedAt: string;
}

export type AnswerValue = string | string[] | number | null;

export interface ResponseDoc {
  $id: string;
  formId: string;
  answers: Record<string, AnswerValue>;
  fileIds?: Record<string, string>;
  submittedAt: string;
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Short text",
  email: "Email",
  number: "Number",
  textarea: "Long text",
  select: "Dropdown",
  radio: "Single choice",
  checkbox: "Multi choice",
  rating: "Rating",
  file: "File upload",
  date: "Date",
};

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  text: "Type",
  email: "@",
  number: "#",
  textarea: "¶",
  select: "▾",
  radio: "◉",
  checkbox: "☑",
  rating: "★",
  file: "⇪",
  date: "📅",
};
