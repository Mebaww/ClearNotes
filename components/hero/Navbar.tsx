"use client";

import { ModeToggle } from "../toggle";
import { GetStartedButton } from "./GetStartedButton";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="absolute top-0 z-20 w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex w-full items-center justify-between rounded-full border border-border bg-card/80 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:bg-card/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={25} height={25} />
            <span className="font-heading text-lg tracking-tight text-foreground">
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
            <ModeToggle />
            <GetStartedButton
              label="Get Started"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 active:scale-[0.98]"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
