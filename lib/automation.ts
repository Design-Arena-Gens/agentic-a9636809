import { promises as fs } from "fs";
import os from "os";
import { composeAudioTrack } from "./audio";
import { fetchBackgroundImage } from "./backgrounds";
import { publishReelToInstagram } from "./instagram";
import { synthesizeNarration, type VoicePreset } from "./narration";
import type { QuoteSeed } from "./quotes";
import { KRISHNA_HASHTAGS, getRandomQuoteSeed } from "./quotes";
import { buildStoryScript, type StoryScript } from "./story";
import { uploadVideoToBlob } from "./storage";
import { renderVerticalVideo } from "./video";
import { createTempId, sanitizeForFilename } from "./utils";

export type AutomationRequest = {
  topic: string;
  tone: string;
  emphasis?: string;
  voice?: VoicePreset;
  duration?: number;
  hashtags?: string[];
  quoteOverride?: QuoteSeed;
  postToInstagram: boolean;
};

export type AutomationLogEntry = {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
};

export type AutomationResult = {
  quote: QuoteSeed;
  script: StoryScript;
  caption: string;
  videoPath: string;
  videoUrl: string | null;
  instagram:
    | { status: "skipped"; reason: string }
    | { status: "success"; mediaId: string; permalink: string | null };
  steps: AutomationLogEntry[];
};

const DEFAULT_DURATION = 15;

export async function runAutomation(
  request: AutomationRequest,
): Promise<AutomationResult> {
  const duration = request.duration ?? DEFAULT_DURATION;
  const steps: AutomationLogEntry[] = [];

  const log = (label: string, detail: string) => {
    const entry: AutomationLogEntry = {
      id: createTempId("log"),
      label,
      detail,
      timestamp: new Date().toISOString(),
    };
    steps.push(entry);
    return entry;
  };

  const quote = request.quoteOverride ?? getRandomQuoteSeed();
  log("Selected Quote", `${quote.text} (${quote.source})`);

  const script = await buildStoryScript({
    quote,
    tone: request.tone,
    emphasis: request.emphasis ?? request.topic,
  });
  log("Generated Script", script.full);

  const narrationPath = await synthesizeNarration(script.full, request.voice);
  log(
    "Narration",
    narrationPath
      ? "Synthesized voice-over using OpenAI TTS."
      : "No TTS available — using instrumental bed only.",
  );

  const audioPath = await composeAudioTrack(narrationPath, duration);
  log("Audio Mix", `Created audio bed (${duration}s).`);

  const background = await fetchBackgroundImage(
    `${request.topic} krishna spiritual`,
  );
  log(
    "Background",
    background.attribution
      ? `Fetched portrait from ${background.attribution}`
      : "Using local backdrop asset.",
  );

  const { path: videoPath, subtitlePath } = await renderVerticalVideo({
    backgroundPath: background.path,
    audioPath,
    script,
    duration,
    accentColor: "0xfaa33b",
  });
  log("Video Render", `Rendered 9:16 MP4 via ffmpeg-wrapped pipeline.`);

  const caption = composeCaption(quote, script, request.hashtags);

  const fileName = `${sanitizeForFilename(quote.id)}-${Date.now()}.mp4`;
  const videoUrl = await uploadVideoToBlob(videoPath, fileName);
  log(
    "Upload",
    videoUrl
      ? `Uploaded reel to Vercel Blob: ${videoUrl}`
      : "Skip upload — VERCEL_BLOB_READ_WRITE_TOKEN missing.",
  );

  const instagram = request.postToInstagram && videoUrl
    ? await publishReelToInstagram({
        videoUrl,
        caption,
      }).then((result) => {
        if (result.status === "success") {
          log(
            "Instagram",
            `Published reel (media id ${result.mediaId}).`,
          );
        } else {
          log("Instagram", `Skipped: ${result.reason}`);
        }
        return result;
      })
    : {
        status: "skipped" as const,
        reason: videoUrl
          ? "Instagram automation disabled."
          : "No public video URL available to publish.",
      };

  const result: AutomationResult = {
    quote,
    script,
    caption,
    videoPath,
    videoUrl,
    instagram,
    steps,
  };

  await cleanupTemp([narrationPath, audioPath, subtitlePath]);

  return result;
}

function composeCaption(
  quote: QuoteSeed,
  script: StoryScript,
  extraHashtags?: string[],
) {
  const base = `"${quote.text}" — ${quote.source}`;
  const cta = script.callToAction;
  const hashtags = Array.from(
    new Set([
      ...(extraHashtags ?? []),
      ...KRISHNA_HASHTAGS,
    ]),
  )
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .join(" ");

  return `${base}\n\n${cta}\n\n${hashtags}`;
}

async function cleanupTemp(paths: Array<string | null>) {
  const deletions = paths
    .filter((value): value is string => !!value && isTmp(value))
    .map((value) =>
      fs.unlink(value).catch(() => {
        // ignore
      })
    );

  await Promise.allSettled(deletions);
}

function isTmp(filePath: string) {
  return filePath.startsWith(os.tmpdir());
}
