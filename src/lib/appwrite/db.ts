"use client";

import { tablesDB, APPWRITE_IDS, ID } from "./client";
import { Query, Permission, Role, type Models } from "appwrite";
import type { FormDoc, FormField, FormStatus, ResponseDoc } from "@/types/form";

interface FormRow extends Models.Row {
  ownerId: string;
  title: string;
  description?: string;
  status: FormStatus;
  fields: string;
  theme?: string;
}

interface ResponseRow extends Models.Row {
  formId: string;
  answers: string;
  fileIds?: string;
}

function deserializeForm(doc: FormRow): FormDoc {
  return {
    $id: doc.$id,
    ownerId: doc.ownerId,
    title: doc.title,
    description: doc.description,
    status: doc.status,
    fields: JSON.parse(doc.fields) as FormField[],
    theme: doc.theme ? (JSON.parse(doc.theme) as { primaryColor?: string }) : undefined,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
}

function deserializeResponse(doc: ResponseRow): ResponseDoc {
  return {
    $id: doc.$id,
    formId: doc.formId,
    answers: JSON.parse(doc.answers) as Record<string, string | string[] | number | null>,
    fileIds: doc.fileIds ? (JSON.parse(doc.fileIds) as Record<string, string>) : undefined,
    submittedAt: doc.$createdAt,
  };
}

export async function listForms(ownerId: string): Promise<FormDoc[]> {
  const res = await tablesDB.listRows<FormRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.formsTableId,
    queries: [Query.equal("ownerId", ownerId), Query.orderDesc("$updatedAt")],
  });
  return res.rows.map(deserializeForm);
}

export async function getForm(formId: string): Promise<FormDoc> {
  const doc = await tablesDB.getRow<FormRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.formsTableId,
    rowId: formId,
  });
  return deserializeForm(doc);
}

export async function createForm(
  ownerId: string,
  data: { title: string; description?: string; fields: FormField[] },
): Promise<FormDoc> {
  const doc = await tablesDB.createRow<FormRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.formsTableId,
    rowId: ID.unique(),
    data: {
      ownerId,
      title: data.title,
      description: data.description,
      status: "draft",
      fields: JSON.stringify(data.fields),
    },
    permissions: [
      Permission.read(Role.user(ownerId)),
      Permission.update(Role.user(ownerId)),
      Permission.delete(Role.user(ownerId)),
    ],
  });
  return deserializeForm(doc);
}

export async function updateForm(
  formId: string,
  ownerId: string,
  patch: {
    title?: string;
    description?: string;
    status?: FormStatus;
    fields?: FormField[];
    theme?: { primaryColor?: string };
  },
): Promise<FormDoc> {
  const data: Record<string, unknown> = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.fields !== undefined) data.fields = JSON.stringify(patch.fields);
  if (patch.theme !== undefined) data.theme = JSON.stringify(patch.theme);

  const doc = await tablesDB.updateRow<FormRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.formsTableId,
    rowId: formId,
    data,
    permissions: [
      Permission.read(Role.user(ownerId)),
      Permission.update(Role.user(ownerId)),
      Permission.delete(Role.user(ownerId)),
      ...(patch.status === "published"
        ? [Permission.read(Role.any())]
        : []),
    ],
  });
  return deserializeForm(doc);
}

export async function deleteForm(formId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.formsTableId,
    rowId: formId,
  });
}

export async function duplicateForm(
  ownerId: string,
  source: FormDoc,
): Promise<FormDoc> {
  return createForm(ownerId, {
    title: `${source.title} (Copy)`,
    description: source.description,
    fields: source.fields,
  });
}

export async function listResponses(formId: string): Promise<ResponseDoc[]> {
  const res = await tablesDB.listRows<ResponseRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.responsesTableId,
    queries: [Query.equal("formId", formId), Query.orderDesc("$createdAt")],
  });
  return res.rows.map(deserializeResponse);
}

export async function createResponse(
  formId: string,
  answers: Record<string, string | string[] | number | null>,
  fileIds?: Record<string, string>,
): Promise<ResponseDoc> {
  const doc = await tablesDB.createRow<ResponseRow>({
    databaseId: APPWRITE_IDS.databaseId,
    tableId: APPWRITE_IDS.responsesTableId,
    rowId: ID.unique(),
    data: {
      formId,
      answers: JSON.stringify(answers),
      fileIds: fileIds ? JSON.stringify(fileIds) : undefined,
    },
    permissions: [
      Permission.create(Role.any()),
      Permission.read(Role.any()),
    ],
  });
  return deserializeResponse(doc);
}

export type { Models };
