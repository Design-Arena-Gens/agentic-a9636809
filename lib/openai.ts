import OpenAI from "openai";
import { env } from "./env";

let cached: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  if (!cached) {
    cached = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return cached;
}
