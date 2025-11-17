import { promises as fs } from "fs";
import { put } from "@vercel/blob";
import { env } from "./env";

export async function uploadVideoToBlob(
  filePath: string,
  fileName: string,
): Promise<string | null> {
  if (!env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    return null;
  }

  const data = await fs.readFile(filePath);
  const blob = await put(fileName, data, {
    access: "public",
    token: env.VERCEL_BLOB_READ_WRITE_TOKEN,
    contentType: "video/mp4",
  });

  return blob.url;
}
