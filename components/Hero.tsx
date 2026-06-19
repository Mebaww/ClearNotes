import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border px-6 pb-24 pt-32 sm:pb-28 sm:pt-40 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/3 h-120 w-120 rounded-full opacity-25 blur-[120px] dark:bg-primary dark:opacity-[0.08]" />
          <div className="absolute top-20 -right-32 h-100 w-100 rounded-full bg-border opacity-30 blur-[120px] dark:bg-foreground dark:opacity-[0.03]" />
          <div className="absolute -bottom-32 left-10 h-90 w-90 rounded-full bg-primary/20 opacity-25 blur-[120px] dark:bg-primary dark:opacity-[0.05]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-4 md:gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="animate-fade-up">
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Read less.
              <br />
              <span className="relative inline-block">
                <span className="relative">Understand more.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              ClearNotes turns dense PDFs, presentations, and Word files into
              clean, structured notes you can actually use for work and study.
            </p>
            <div className="mt-8">
              <WaitlistForm size="large" buttonLabel="Join the waitlist" />
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-card/60 px-3.5 py-3 backdrop-blur-xl dark:bg-card/40">
                <p className="font-semibold text-foreground">PDFs</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Reports & studies</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 px-3.5 py-3 backdrop-blur-xl dark:bg-card/40">
                <p className="font-semibold text-foreground">Slides</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Decks & pitchbooks</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 px-3.5 py-3 backdrop-blur-xl dark:bg-card/40">
                <p className="font-semibold text-foreground">Docs</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Briefs & manuals</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up pt-4 md:pt-6 md:pr-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/85 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:bg-card/40 dark:shadow-black/40">
              <div className="flex items-center gap-2 border-b border-border bg-card/50 px-4 py-3 dark:bg-card/20">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <p className="flex-1 text-center text-xs font-medium text-muted-foreground">
                  Quarterly_Report_Q3.pdf
                </p>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Source document
                </p>
                <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-foreground/80">
                  <p>
                    Our enterprise expansion grew{" "}
                    <mark className="rounded bg-primary/20 px-0.5 text-foreground">
                      14% this quarter
                    </mark>
                    , driven largely by adoption of{" "}
                    <mark className="rounded bg-foreground/10 px-0.5 text-foreground">
                      automated compliance tools
                    </mark>
                    .
                  </p>
                  <p>
                    Leadership flagged{" "}
                    <mark className="rounded bg-primary/20 px-0.5 text-foreground">
                      three open risk items
                    </mark>{" "}
                    ahead of the Q4 planning cycle.
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    ClearNotes output
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Key takeaways
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          Three financial goals met; product timeline confirmed
                          for launch.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground">
                        <Layers3 className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Organized sections
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          Action items, timelines, and risk flags extracted and
                          grouped.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary px-6 py-20 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple from upload to notes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A focused workflow that helps you get to the important parts without the noise.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <Upload className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">Upload</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Drop in a PDF, slide deck, or Word doc.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Sparkles className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">Extract</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pull out the key ideas and important details.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:bg-card/75 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground">
              <BookOpen className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">Review</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get structured notes you can skim and reuse.
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-b border-border bg-background px-6 py-20 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Why people like it
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Designed to feel effortless
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            ClearNotes helps you move from a long file to something useful in a few steps.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Zap className="h-5.5 w-5.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Less noise</h3>
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
              <h3 className="text-base font-semibold text-foreground">Built for real work</h3>
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
              <h3 className="text-base font-semibold text-foreground">Fast to scan</h3>
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
              <h3 className="text-base font-semibold text-foreground">Simple by design</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                No clutter, no learning curve, just clear output.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="relative overflow-hidden bg-secondary px-6 py-20 sm:py-24 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-primary/20 opacity-15 blur-[120px] dark:bg-primary dark:opacity-[0.06]" />
        </div>
        <div className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Early access
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Join the waitlist
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Get notified when ClearNotes is ready and be first to try it.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm size="large" buttonLabel="Get early access" />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background px-6 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ClearNotes. All rights reserved.
      </footer>
    </main>
  );
}
