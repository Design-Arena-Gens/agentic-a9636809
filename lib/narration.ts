import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { getOpenAIClient } from "./openai";
import { createTempId } from "./utils";

export type VoicePreset = "alloy" | "verse" | "sage";

export async function synthesizeNarration(
  script: string,
  voice: VoicePreset = "alloy",
): Promise<string | null> {
  if (!script.trim()) {
    return null;
  }

  const openai = getOpenAIClient();

  if (!openai) {
    return null;
  }

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice,
    input: script,
  });

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(os.tmpdir(), `${createTempId("voice")}.mp3`);
  await fs.writeFile(filePath, audioBuffer);
  return filePath;
}
