import { AutomationClient } from "@/app/components/automation-client";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(78,115,255,0.25),_transparent_55%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20">
        <section className="relative grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-lg">
          <div className="grid gap-5 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-sky-400/50 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
                Krishna Reel Automations
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Generate 10-15s shorts with divine storytelling and auto-post to
                Instagram — end to end in minutes.
              </h1>
              <p className="max-w-2xl text-lg text-slate-200/80">
                Inspired by leading devotional creators, this workflow summons a
                Bhagavad Gita quote, crafts narration, renders a cinematic reel,
                uploads to Vercel Blob, and publishes straight to Instagram via
                Graph API where credentials are provided.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-200/70">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-wide text-slate-300/70">
                    Inspiration
                  </span>
                  <p className="mt-1 font-medium text-white">
                    vasudeva_shri_krishna · devotteyt · hd_creation3827
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-wide text-slate-300/70">
                    Hashtag Palette
                  </span>
                  <p className="mt-1 font-medium text-white">
                    #LordKrishna #BhagavadGita #KrishnaMotivation
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-inner shadow-sky-500/30">
              <h2 className="text-lg font-semibold text-sky-100">
                Pipeline at a glance
              </h2>
              <ul className="space-y-3 text-sm text-slate-200/80">
                <li>1. Draft hook &amp; narration from curated Gita quotes.</li>
                <li>2. Generate TTS voiceover &amp; mix with 432hz ambience.</li>
                <li>3. Render 9:16 reel with kinetic typography overlays.</li>
                <li>4. Upload to Vercel Blob and (optionally) post to Instagram.</li>
              </ul>
              <span className="text-xs uppercase tracking-widest text-slate-400">
                Agent ready · Fully autonomous
              </span>
            </div>
          </div>
        </section>

        <AutomationClient />
      </div>
    </main>
  );
}
