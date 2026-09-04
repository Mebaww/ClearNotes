import {
  BookOpen,
  Clock3,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { GetStartedButton } from "./GetStartedButton";
import { HeroAnimation } from "./HeroAnimation";
import Link from "next/link";
export default function Hero() {
  return (
    <main className="bg-gray-50 dark:bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border  px-6 pb-24 pt-32 sm:pb-28 sm:pt-40 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
         
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-4 md:gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="animate-fade-up">
            <h1 className="mt-6 max-w-2xl font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Read less.
              <br />
              <span className="relative inline-block">
                <span className="relative">Understand more.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
ClearNotes extracts the important information from your documents and turns it into clear, organized notes you can actually use for work, research, and study
            </p>
            

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-card/80 px-3.5 py-3 backdrop-blur-xl dark:bg-card/50">
                <p className="font-semibold text-foreground">PDFs</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Reports & studies
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card/80 px-3.5 py-3 backdrop-blur-xl dark:bg-card/50">
                <p className="font-semibold text-foreground">Slides</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Decks & pitchbooks
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card/80 px-3.5 py-3 backdrop-blur-xl dark:bg-card/50">
                <p className="font-semibold text-foreground">Docs</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Briefs & manuals
                </p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up pt-4 md:pt-6 md:pr-6">
            <HeroAnimation />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-background border-b border-border px-6 py-20 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Simple from upload to notes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A focused workflow that helps you get to the important parts without
            the noise.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg  dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <Upload className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">
              Upload
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Drop in a PDF, slide deck, or Word doc.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Sparkles className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">
              Extract
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pull out the key ideas and important details.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <BookOpen className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">
              Review
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get structured notes you can skim and reuse.
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-b border-border bg-gray-50 dark:bg-background px-6 py-20 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Why people like it
          </p>
          <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Designed to feel effortless
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            ClearNotes helps you move from a long file to something useful in a
            few steps.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Zap className="h-5.5 w-5.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Less noise
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Strip away filler so the important points stand out.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <GraduationCap className="h-5.5 w-5.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Built for real work
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Useful for study, research, and team review.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <Clock3 className="h-5.5 w-5.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Fast to scan
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Readable notes that make long documents easier to revisit.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <ShieldCheck className="h-5.5 w-5.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Simple by design
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                No clutter, no learning curve, just clear output.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden px-6 py-20 sm:py-24 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-primary/10 opacity-30 blur-[120px] dark:bg-primary dark:opacity-[0.06]" />
        </div>
        <div className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] sm:p-16 dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Now Live
            </p>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Stop reading. Start understanding.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
           Upload your document and get clear, organized notes in seconds. Try it free, no credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <GetStartedButton
              label="Try it now"
              size="lg"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] sm:w-auto cursor-pointer"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background px-6 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ClearNotes. All rights reserved.
        made by {` `}
        <Link href="https://meva.work">
          <span className="font-semibold text-foreground">meva.work</span>
        </Link>
      </footer>
    </main>
  );
}
