"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/lib/appwrite/auth";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (mounted) setUser(user);
      } catch {
        if (mounted) setUser(null);
      }
    })();
    return () => {
      mounted = false;
      setLoading(false);
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
