"use client";

import { FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="absolute top-0 z-20 w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex w-full items-center justify-between rounded-full border border-black/5 bg-white/70 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8863B] text-white dark:bg-[#E0B568] dark:text-[#15120A]">
              <FileText className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-[#1D1D1F] dark:text-zinc-50">
              ClearNotes
            </span>
          </a>
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="#features"
              className="hidden text-sm font-medium text-[#6E6E73] transition hover:text-[#1D1D1F] sm:block dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Features
            </a>
            <a
              href="#waitlist"
              className="hidden text-sm font-medium text-[#6E6E73] transition hover:text-[#1D1D1F] sm:block dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Waitlist
            </a>
            {/* <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white/60 text-[#6E6E73] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:text-[#1D1D1F] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <Moon className="h-4.5 w-4.5 dark:hidden" strokeWidth={2.25} />
              <Sun className="hidden h-4.5 w-4.5 dark:block" strokeWidth={2.25} />
            </button> */}
            <button
              onClick={scrollToWaitlist}
              className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2C2C2E] active:translate-y-0 active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Join waitlist
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
