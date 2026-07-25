"use client";

import { useEffect } from "react";

/**
 * Registers the ClearNotes service worker for PWA support.
 * Drop this into your root layout as a client component.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => {
          console.log("[PWA] Service worker registered:", registration.scope);
        })
        .catch((err) => {
          console.error("[PWA] Service worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
