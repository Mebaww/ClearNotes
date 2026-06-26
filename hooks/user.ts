"use client";

import { authClient } from "@/lib/auth-client";

export function useUser() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  return {
    user: session?.user ?? null,
    session,
    isLoading: isPending,
    error,
    refetch,
    isAuthenticated: !!session,
  };
}