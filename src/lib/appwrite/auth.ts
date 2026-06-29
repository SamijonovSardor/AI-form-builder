"use client";

import { account, ID } from "./client";
import type { Models } from "appwrite";

export type AppwriteUser = Models.User<Models.Preferences>;

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AppwriteUser> {
  await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function signIn(email: string, password: string): Promise<void> {
  await account.createEmailPasswordSession(email, password);
}

export async function signOut(): Promise<void> {
  await account.deleteSession({ sessionId: "current" });
}

export async function getCurrentUser(): Promise<AppwriteUser | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}
