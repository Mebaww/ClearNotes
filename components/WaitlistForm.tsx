"use client";

import { type FormEvent, useId, useState } from "react";
import axios from "axios";
import { sileo } from "sileo";
import { ArrowRight, Mail } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = waitlistSchema.safeParse({
      email,
      source: getUTMSource(),
    });

    if (!parsed.success) {
      sileo.error({
        title: "Invalid email",
        description:
          parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sileo.promise(axios.post("/api/waitlist", parsed.data), {
        loading: {
          title: "Joining waitlist…",
          description: "Saving your spot.",
        },
        success: {
          title: "You're on the list! 🎉",
          description: "We'll reach out when ClearNotes is ready.",
        },
        error: {
          title: "Something went wrong",
          description: "Couldn't save your email. Please try again.",
        },
      });

      setEmail("");
    } catch {
      // errors are already displayed by sileo.promise above
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLarge = size === "large";

  return (
    <div className={`w-full ${isLarge ? "max-w-xl" : "max-w-lg"}`}>
      <form
        id={id ?? generatedId}
        onSubmit={submit}
        className={`group flex flex-col gap-2 rounded-[1.75rem] border p-2 transition duration-200 sm:flex-row sm:items-center sm:rounded-full ${
          focused
            ? "border-primary/50 bg-card/85 ring-4 ring-primary/15"
            : "border-border bg-card/75 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
        } ${isLarge ? "sm:p-2" : "sm:p-1.5"}`}
        noValidate
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-transparent px-3 text-foreground">
          <Mail
            className={`h-4.5 w-4.5 shrink-0 transition ${
              focused ? "text-primary" : "text-muted-foreground"
            }`}
            strokeWidth={2}
          />
          <input
            type="email"
            aria-label="Email for waitlist"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
}
