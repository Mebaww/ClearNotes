"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Lock } from "lucide-react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/workspace",
        errorCallbackURL: "/auth",
        newUserCallbackURL: "/workspace",
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[340px] space-y-4">

        {/* Card — contains everything */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">

          {/* Logo + brand inside card */}
          <div className="flex flex-col items-center gap-3 text-center mb-7">
            <Image src="/logo.png" alt="ClearNotes" width={36} height={36} />
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                ClearNotes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to continue to your workspace.
              </p>
            </div>
          </div>

          {/* Google button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-150 hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_3px_rgba(184,134,59,0.09)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>{isLoading ? "Signing in…" : "Continue with Google"}</span>
          </button>

          {/* Security note */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
            <Lock className="h-3 w-3 shrink-0" />
            Secured with Google OAuth 
          </p>
        </div>

    
      </div>
    </div>
  );
}