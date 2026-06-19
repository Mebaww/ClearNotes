"use client";

import { type FormEvent, useId, useState } from "react";
import { AlertCircle, ArrowRight, Check, Mail } from "lucide-react";

type WaitlistFormProps = {
  id?: string;
  buttonLabel?: string;
  size?: "default" | "large";
  variant?: "dark" | "light";
};

export default function WaitlistForm({
  id,
  buttonLabel = "Join waitlist",
  size = "default",
  variant = "dark",
}: WaitlistFormProps) {
  const generatedId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"" | "ok" | "error">("");
  const [focused, setFocused] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  const isLarge = size === "large";
  const isLight = variant === "light";
  const messageId = `${id ?? generatedId}-status`;
  const hasError = status === "error";
  const hasSuccess = status === "ok";

  return (
    <div className={`w-full ${isLarge ? "max-w-xl" : "max-w-lg"}`}>
      <form
        id={id}
        onSubmit={submit}
        className={`group flex flex-col gap-2 rounded-[1.75rem] border p-2 transition duration-200 sm:flex-row sm:items-center sm:rounded-full ${
          hasError
            ? "border-destructive/30 bg-destructive/10 ring-4 ring-destructive/10"
            : focused
              ? "border-primary/50 bg-card/85 ring-4 ring-primary/15"
              : "border-border bg-card/75 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:shadow-black/30"
        } ${isLarge ? "sm:p-2" : "sm:p-1.5"}`}
        noValidate
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-transparent px-3 text-foreground">
          <Mail
            className={`h-4.5 w-4.5 shrink-0 transition ${
              focused
                ? "text-primary"
                : hasError
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
            strokeWidth={2}
          />
          <input
            type="email"
            aria-label="Email for waitlist"
            aria-invalid={hasError}
            aria-describedby={status ? messageId : undefined}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
               setEmail(e.target.value);
               if (status) setStatus("");
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${
              isLarge ? "py-2.5 text-base" : "py-2 text-sm"
            }`}
          />
        </div>
        <button
          type="submit"
          className={`flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:translate-y-0 active:scale-[0.98] sm:w-auto ${
            isLarge ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm"
          }`}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {hasSuccess && (
        <p id={messageId} className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
          <Check className="h-4 w-4" strokeWidth={2.5} />
          You&apos;re on the list.
        </p>
      )}
      {hasError && (
        <p id={messageId} className="mt-3 flex items-center gap-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={2.5} />
          Enter a valid email address.
        </p>
      )}
    </div>
  );
}
