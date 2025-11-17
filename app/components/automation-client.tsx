"use client";

import { useMemo, useState, useTransition } from "react";
import { createReelAction } from "@/app/actions/create-reel";
import type { AutomationActionResponse } from "@/app/actions/create-reel";
import { KRISHNA_HASHTAGS } from "@/lib/quotes";

type FormState = {
  topic: string;
  tone: string;
  emphasis: string;
  voice: "alloy" | "verse" | "sage";
  autoPost: boolean;
};

const INITIAL_FORM: FormState = {
  topic: "Lord Krishna motivation",
  tone: "devotional and uplifting",
  emphasis: "daily discipline and inner courage",
  voice: "alloy",
  autoPost: false,
};

export function AutomationClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [result, setResult] = useState<AutomationActionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const hashtagString = useMemo(
    () => KRISHNA_HASHTAGS.join(" "),
    [],
  );

  const submit = () => {
    setResult(null);
    startTransition(async () => {
      const response = await createReelAction({
        topic: form.topic,
        tone: form.tone,
        emphasis: form.emphasis,
        voice: form.voice,
        autoPost: form.autoPost,
        hashtags: KRISHNA_HASHTAGS,
      });
      setResult(response);
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/60 p-8 backdrop-blur-md shadow-xl shadow-sky-900/10 dark:bg-zinc-900/80">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Automation Blueprint
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Feed a theme and tone, then let the pipeline draft a Krishna quote
            narrative, voice it, render a cinematic 9:16 reel, and optionally
            post it to Instagram in one click.
          </p>
        </div>

        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Theme Focus
            <input
              className="rounded-xl border border-zinc-300 bg-white/80 px-4 py-3 text-base text-zinc-900 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              value={form.topic}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, topic: event.target.value }))
              }
              placeholder="e.g. Resilience in the face of doubt"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Tone
            <input
              className="rounded-xl border border-zinc-300 bg-white/80 px-4 py-3 text-base text-zinc-900 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              value={form.tone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tone: event.target.value }))
              }
              placeholder="e.g. devotional, cinematic, high energy"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Narration Emphasis
            <input
              className="rounded-xl border border-zinc-300 bg-white/80 px-4 py-3 text-base text-zinc-900 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              value={form.emphasis}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, emphasis: event.target.value }))
              }
              placeholder="e.g. balance discipline with surrender"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Voice
            <select
              className="rounded-xl border border-zinc-300 bg-white/80 px-4 py-3 text-base text-zinc-900 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              value={form.voice}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  voice: event.target.value as FormState["voice"],
                }))
              }
            >
              <option value="alloy">Alloy — Warm narrator</option>
              <option value="verse">Verse — Smooth cinematic</option>
              <option value="sage">Sage — Deep meditative</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-inner dark:border-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-200 md:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500"
              checked={form.autoPost}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, autoPost: event.target.checked }))
              }
            />
            Auto-post to Instagram once the reel is rendered
          </label>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Hashtags
            </span>
            <code className="rounded-lg bg-zinc-900 px-3 py-2 text-xs text-zinc-100 dark:bg-zinc-800">
              {hashtagString}
            </code>
          </div>

          <button
            type="submit"
            className="md:col-span-2 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:shadow-xl hover:shadow-sky-600/35 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Generating reel..." : "Generate 15s Krishna Reel"}
          </button>
        </form>
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-zinc-900/90 p-8 text-sm text-zinc-200 shadow-2xl shadow-indigo-900/40">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Automation Console
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              Logs each stage in the pipeline with timestamps.
            </p>
          </div>
          {result?.ok && (
            <div className="flex flex-wrap items-center gap-3">
              {result.videoUrl && (
                <a
                  href={result.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200 hover:bg-emerald-500/30"
                >
                  Download Video
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!result?.ok) return;
                  navigator.clipboard.writeText(result.caption).catch(() => {
                    // ignore
                  });
                }}
                className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-200 hover:bg-zinc-800"
              >
                Copy Caption
              </button>
            </div>
          )}
        </header>

        <div className="grid gap-4">
          {isPending && (
            <div className="animate-pulse rounded-2xl border border-zinc-700/40 bg-zinc-800/80 p-4 text-zinc-300">
              Processing pipeline…
            </div>
          )}

          {!isPending && result?.ok && (
            <>
              <div className="grid gap-2">
                <h4 className="text-sm font-semibold text-zinc-100">
                  Caption
                </h4>
                <p className="rounded-2xl border border-zinc-700/40 bg-zinc-800/80 p-4 text-zinc-200">
                  {result.caption}
                </p>
              </div>

              <ul className="grid gap-3">
                {result.steps.map((step) => (
                  <li
                    key={step.id}
                    className="rounded-2xl border border-zinc-700/40 bg-zinc-800/80 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-sky-300">
                        {step.label}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-800/80 p-4">
                <h4 className="text-sm font-semibold text-zinc-100">
                  Instagram Status
                </h4>
                <p className="mt-2 text-sm text-zinc-300">
                  {result.instagram.status === "success"
                    ? `Published successfully (media id: ${result.instagram.mediaId})`
                    : `Skipped: ${result.instagram.reason}`}
                </p>
                {result.instagram.status === "success" &&
                  result.instagram.permalink && (
                    <a
                      href={result.instagram.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300 hover:text-sky-100"
                    >
                      View Reel
                    </a>
                  )}
              </div>
            </>
          )}

          {!isPending && result && !result.ok && (
            <div className="rounded-2xl border border-red-600/40 bg-red-950/70 p-4 text-sm text-red-200">
              <h4 className="font-semibold uppercase tracking-wide">
                Automation Failed
              </h4>
              <p className="mt-2">{result.error}</p>
              {result.hint && (
                <p className="mt-3 text-xs text-red-300/80">{result.hint}</p>
              )}
            </div>
          )}

          {!isPending && !result && (
            <div className="rounded-2xl border border-zinc-700/40 bg-zinc-800/60 p-4 text-sm text-zinc-400">
              Fill the brief and launch the pipeline to see detailed logs and
              download links here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
