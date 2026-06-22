"use client";

import { type FormEvent, useId, useState } from "react";
import axios from "axios";
import { AlertCircle, ArrowRight, Check, Mail } from "lucide-react";

import { getUTMSource } from "@/lib/utm";
import { waitlistSchema } from "@/lib/validations/waitlist";

type WaitlistFormProps = {
  id?: string;
  buttonLabel?: string;
  size?: "default" | "large";
};

export default function WaitlistForm({
  id,
  buttonLabel = "Join waitlist",
  size = "default",
}: WaitlistFormProps) {
  const generatedId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("Enter a valid email address.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = waitlistSchema.safeParse({
      email,
      source: getUTMSource(),
    });

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await axios.post("/api/waitlist", parsed.data);
      setEmail("");
      setStatus("success");
      setMessage("You're on the list.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLarge = size === "large";
  const messageId = `${id ?? generatedId}-status`;
  const hasError = status === "error";
  const hasSuccess = status === "success";

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
              : "border-border bg-card/75 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
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
              if (status !== "idle") {
                setStatus("idle");
              }
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
          disabled={isSubmitting}
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
          {message}
        </p>
      )}
      {hasError && (
        <p id={messageId} className="mt-3 flex items-center gap-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={2.5} />
          {message}
        </p>
      )}
    </div>
  );
}
