import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { StoryScript } from "./story";
import { createTempId, sanitizeForFilename } from "./utils";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export type VideoRenderConfig = {
  backgroundPath: string;
  audioPath: string;
  script: StoryScript;
  duration: number;
  accentColor?: string;
};

export async function renderVerticalVideo({
  backgroundPath,
  audioPath,
  script,
  duration,
  accentColor = "0xf8d27c",
}: VideoRenderConfig): Promise<{ path: string; subtitlePath: string }> {
  const outputPath = path.join(
    os.tmpdir(),
    `${createTempId("reel")}-${sanitizeForFilename(script.hook)}.mp4`,
  );

  const subtitlePath = await createSubtitleFile(script, duration);

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .addInput(backgroundPath)
      .inputOptions(["-loop 1"])
      .addInput(audioPath)
      .complexFilter(
        [
          `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0012,1.08)':d=${
            duration * 30
          }:s=1080x1920,eq=brightness=0.03:saturation=1.2:contrast=1.05[v0]`,
          `[v0]drawbox=0:0:iw:160:color=${accentColor}@0.35:t=fill,format=yuv420p,ass='${subtitlePath.replace(
            /'/g,
            "\\'",
          )}'[vout]`,
        ],
        "vout",
      )
      .outputOptions([
        "-map [vout]",
        "-map 1:a",
        "-c:v libx264",
        "-preset veryfast",
        "-profile:v high",
        "-pix_fmt yuv420p",
        `-t ${duration}`,
        "-shortest",
        "-c:a aac",
        "-b:a 160k",
        `-metadata encoded_by=AgenticKrishna`,
        `-metadata title=${script.hook}`,
      ])
      .on("end", () => resolve())
      .on("error", (error) => reject(error))
      .save(outputPath);
  });

  return {
    path: outputPath,
    subtitlePath,
  };
}

async function createSubtitleFile(script: StoryScript, duration: number) {
  const segments = [script.hook, ...script.narration, script.callToAction];
  const perSegment = duration / segments.length;
  const body = segments
    .map((line, index) => {
      const start = secondsToTimestamp(perSegment * index);
      const end = secondsToTimestamp(perSegment * (index + 1));
      return `Dialogue: 0,${start},${end},Primary,,0,0,0,,${escapeAss(line)}`;
    })
    .join("\n");

  const content = `[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Primary,Lora,72,&H00FFFFFF,&H000000FF,&H00000000,&H8F000000,0,0,0,0,100,100,0,0,1,4,12,2,80,80,140,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${body}
`;

  const subtitlePath = path.join(
    os.tmpdir(),
    `${createTempId("subs")}.ass`,
  );
  await fs.writeFile(subtitlePath, content, "utf8");
  return subtitlePath;
}

function secondsToTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const milliseconds = Math.floor((secs - Math.floor(secs)) * 100);
  return `${pad(hours)}:${pad(minutes)}:${pad(Math.floor(secs))}.${pad(
    milliseconds,
    2,
  )}`;
}

function pad(value: number, size = 2) {
  return value.toString().padStart(size, "0");
}

function escapeAss(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
}
