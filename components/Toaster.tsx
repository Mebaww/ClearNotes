"use client";

import { useTheme } from "next-themes";
import { Toaster as SileoToaster } from "sileo";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SileoToaster
      theme={resolvedTheme as "light" | "dark" | "system"}
      position="top-center"
    />
  );
}
