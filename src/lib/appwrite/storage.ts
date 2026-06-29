"use client";

import { storage, APPWRITE_IDS, ID } from "./client";

export async function uploadFile(file: File): Promise<string> {
  const res = await storage.createFile({
    bucketId: APPWRITE_IDS.filesBucketId,
    fileId: ID.unique(),
    file,
  });
  return res.$id;
}

export function getFileViewUrl(fileId: string): string {
  try {
    return storage.getFileView({
      bucketId: APPWRITE_IDS.filesBucketId,
      fileId,
    }).toString();
  } catch {
    return "";
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  await storage.deleteFile({
    bucketId: APPWRITE_IDS.filesBucketId,
    fileId,
  });
}
