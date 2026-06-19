"use client";

import { FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ModeToggle } from "./toggle";
import Image from "next/image";
const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="absolute top-0 z-20 w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex w-full items-center justify-between rounded-full border border-border bg-card/70 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:bg-card/5 dark:shadow-black/20">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.PNG" alt="Logo" width={28} height={28} />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ClearNotes
            </span>
          </a>
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="#features"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Features
            </a>
            <a
              href="#waitlist"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Waitlist
            </a>
            <ModeToggle />
            <button
              onClick={scrollToWaitlist}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-foreground/90 active:translate-y-0 active:scale-[0.98]"
            >
              Join Waitlist
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
