import { z } from "zod";
import type { FormField } from "@/types/form";

export const fieldTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "rating",
  "file",
  "date",
]);

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: fieldTypeSchema,
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  minRating: z.number().int().positive().optional(),
  maxRating: z.number().int().positive().optional(),
});

export const formFieldsArraySchema = z.array(formFieldSchema);

export const aiFormResponseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: formFieldsArraySchema,
});

export type AIFormResponse = z.infer<typeof aiFormResponseSchema>;

/**
 * Build a runtime Zod schema for a list of form fields.
 * The shape is keyed by field.id and is used by both the public form page
 * and the AI validation step.
 */
export function buildZodSchema(
  fields: FormField[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;
    switch (field.type) {
      case "email":
        schema = z.string().email("Please enter a valid email address");
        break;
      case "number":
        schema = z.coerce.number({ error: "Please enter a valid number" });
        break;
      case "checkbox":
        schema = z
          .array(z.string())
          .min(field.required ? 1 : 0, "Please select at least one option");
        break;
      case "rating": {
        const min = field.minRating ?? 1;
        const max = field.maxRating ?? 5;
        schema = z.coerce
          .number({ error: "Please select a rating" })
          .int()
          .min(min)
          .max(max);
        break;
      }
      case "date":
        schema = z.string().min(1, "Please pick a date");
        break;
      case "file":
        schema = z.union([
          z.instanceof(File, { message: "Please upload a file" }),
          z.string().min(1, "Please upload a file"),
        ]);
        break;
      case "text":
      case "textarea":
        schema = z.string();
        break;
      case "select":
      case "radio": {
        const options = field.options ?? [];
        if (options.length > 0) {
          schema = z.string().refine(
            (v) => v === "" || options.includes(v),
            { message: "Please pick a valid option" },
          );
        } else {
          schema = z.string();
        }
        break;
      }
      default: {
        const _exhaustive: never = field.type;
        schema = z.string();
        void _exhaustive;
      }
    }

    if (field.required) {
      if (field.type === "text" || field.type === "textarea" || field.type === "select" || field.type === "radio") {
        schema = (schema as z.ZodString).min(1, "This field is required");
      }
    } else {
      schema = schema.optional().nullable();
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}
