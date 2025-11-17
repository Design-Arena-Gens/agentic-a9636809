import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import os from "os";
import path from "path";
import { createTempId } from "./utils";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const AMBIENCE = path.join(process.cwd(), "public/audio/ambience.mp3");

export async function composeAudioTrack(
  voicePath: string | null,
  durationSeconds: number,
): Promise<string> {
  if (voicePath) {
    const outputPath = path.join(
      os.tmpdir(),
      `${createTempId("mix")}.mp3`,
    );

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .addInput(voicePath)
        .addInput(AMBIENCE)
        .complexFilter([
          "[0:a]volume=1.1[a0]",
          "[1:a]volume=0.25,aloop=loop=-1:size=2e+09[a1]",
          "[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        ])
        .outputOptions([
          "-map [aout]",
          "-c:a mp3",
          "-ar 44100",
          `-t ${durationSeconds}`,
        ])
        .on("end", () => resolve())
        .on("error", (error) => reject(error))
        .save(outputPath);
    });

    return outputPath;
  }

  const fallbackPath = path.join(
    os.tmpdir(),
    `${createTempId("ambience")}.mp3`,
  );

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .addInput(AMBIENCE)
      .outputOptions([
        "-c:a mp3",
        "-ar 44100",
        `-t ${durationSeconds}`,
      ])
      .on("end", () => resolve())
      .on("error", (error) => reject(error))
      .save(fallbackPath);
  });

  return fallbackPath;
}
