"use client";

import { Client, Account, TablesDB, Storage, ID } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn(
    "[appwrite] Missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID env vars.",
  );
}

export const appwriteClient = new Client()
  .setEndpoint(endpoint ?? "https://cloud.appwrite.io/v1")
  .setProject(projectId ?? "");

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
export const storage = new Storage(appwriteClient);

export const APPWRITE_IDS = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  formsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID ?? "forms",
  responsesTableId:
    process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID ?? "responses",
  filesBucketId:
    process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID ?? "form-uploads",
};

export { ID };
