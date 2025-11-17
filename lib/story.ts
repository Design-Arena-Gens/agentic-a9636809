import { getOpenAIClient } from "./openai";
import type { QuoteSeed } from "./quotes";

export type StoryConfig = {
  quote: QuoteSeed;
  tone: string;
  emphasis?: string;
};

export type StoryScript = {
  hook: string;
  narration: string[];
  callToAction: string;
  full: string;
};

const FALLBACK_TEMPLATES = [
  {
    hook: "Pause and breathe in the wisdom of Krishna for a moment.",
    callToAction:
      "Save this message and share Krishna's words with someone who needs courage today.",
  },
  {
    hook: "Here’s a 15-second reminder from the Bhagavad Gita.",
    callToAction:
      "Follow for more divine motivation woven from Krishna’s eternal teachings.",
  },
  {
    hook: "When doubt clouds your path, remember this from Lord Krishna.",
    callToAction:
      "Let these words guide your next step — drop a 🙏 if you feel it.",
  },
];

export async function buildStoryScript({
  quote,
  tone,
  emphasis,
}: StoryConfig): Promise<StoryScript> {
  const openai = getOpenAIClient();

  if (openai) {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a viral short-form script writer. Craft rhythmic, inspiring narration for 10-15s reels. Keep lines short (max 12 words) and deeply rooted in Lord Krishna's teachings. Maintain devotional warmth, modern clarity, and end with a motivating call-to-action.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Base quote: "${quote.text}"`,
                `Source: ${quote.source}`,
                `Context: ${quote.context}`,
                `Desired tone: ${tone}`,
                emphasis ? `Additional focus: ${emphasis}` : "",
                "Deliver JSON with hook, narration (array of 3 short sentences) and callToAction.",
              ]
                .filter(Boolean)
                .join("\n"),
            },
          ],
        },
      ],
    });

    const output = response.output_text?.[0];

    if (output) {
      const json = JSON.parse(output);
      return {
        hook: json.hook,
        narration: json.narration,
        callToAction: json.callToAction,
        full: [json.hook, ...json.narration, json.callToAction].join(" "),
      };
    }
  }

  const fallback = FALLBACK_TEMPLATES[
    Math.floor(Math.random() * FALLBACK_TEMPLATES.length)
  ];

  const narration = [
    quote.text,
    "Let this be your reminder to act with courage today.",
    "Keep faith steady; Krishna walks beside the fearless.",
  ];

  return {
    hook: fallback.hook,
    narration,
    callToAction: fallback.callToAction,
    full: [fallback.hook, ...narration, fallback.callToAction].join(" "),
  };
}
