import crypto from "crypto";
import slugify from "slugify";

export function createTempId(prefix: string) {
  return `${prefix}-${crypto.randomBytes(6).toString("hex")}`;
}

export function sanitizeForFilename(input: string) {
  return slugify(input, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function chunkText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return [text];
  }

  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxLength) {
      chunks.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}
