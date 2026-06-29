"use client";

import { create } from "zustand";
import type { AppwriteUser } from "@/lib/appwrite/auth";

interface AuthState {
  user: AppwriteUser | null;
  loading: boolean;
  setUser: (user: AppwriteUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
