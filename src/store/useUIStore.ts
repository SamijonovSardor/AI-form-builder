"use client";

import { create } from "zustand";

export type PreviewMode = "desktop" | "mobile";
export type MobileTab = "edit" | "preview";

interface UIState {
  previewMode: PreviewMode;
  mobileTab: MobileTab;
  isSaving: boolean;
  setPreviewMode: (mode: PreviewMode) => void;
  setMobileTab: (tab: MobileTab) => void;
  setSaving: (saving: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  previewMode: "desktop",
  mobileTab: "edit",
  isSaving: false,
  setPreviewMode: (previewMode) => set({ previewMode }),
  setMobileTab: (mobileTab) => set({ mobileTab }),
  setSaving: (isSaving) => set({ isSaving }),
}));
