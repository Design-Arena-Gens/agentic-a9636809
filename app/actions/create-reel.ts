'use server';

import { runAutomation, type AutomationResult } from "@/lib/automation";
import type { VoicePreset } from "@/lib/narration";
import { KRISHNA_HASHTAGS } from "@/lib/quotes";
import { z } from "zod";

const inputSchema = z.object({
  topic: z.string().min(1),
  tone: z.string().min(1),
  emphasis: z.string().optional(),
  voice: z.enum(["alloy", "verse", "sage"]).optional(),
  autoPost: z.boolean().optional(),
  hashtags: z
    .array(z.string())
    .default(KRISHNA_HASHTAGS)
    .optional(),
});

export type CreateReelPayload = z.input<typeof inputSchema>;

export type AutomationActionResponse =
  | {
      ok: true;
      videoUrl: string | null;
      caption: string;
      steps: AutomationResult["steps"];
      instagram:
        | { status: "skipped"; reason: string }
        | { status: "success"; mediaId: string; permalink: string | null };
      quote: {
        text: string;
        source: string;
      };
    }
  | {
      ok: false;
      error: string;
      hint?: string;
    };

export async function createReelAction(
  payload: CreateReelPayload,
): Promise<AutomationActionResponse> {
  const parsed = inputSchema.safeParse({
    ...payload,
    autoPost: payload.autoPost ?? false,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid form submission.",
      hint: parsed.error.issues.map((issue) => issue.message).join("\n"),
    };
  }

  try {
    const result = await runAutomation({
      topic: parsed.data.topic,
      tone: parsed.data.tone,
      emphasis: parsed.data.emphasis,
      voice: (parsed.data.voice ?? "alloy") as VoicePreset,
      hashtags: parsed.data.hashtags,
      postToInstagram: parsed.data.autoPost ?? false,
    });

    return {
      ok: true,
      videoUrl: result.videoUrl,
      caption: result.caption,
      steps: result.steps,
      instagram: result.instagram,
      quote: {
        text: result.quote.text,
        source: result.quote.source,
      },
    };
  } catch (error) {
    console.error("Automation failed", error);
    return {
      ok: false,
      error: "Automation failed while generating the reel.",
      hint: (error as Error)?.message,
    };
  }
}
