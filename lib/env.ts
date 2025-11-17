import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  UNSPLASH_ACCESS_KEY: z.string().min(1).optional(),
  INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string().min(1).optional(),
  FACEBOOK_GRAPH_ACCESS_TOKEN: z.string().min(1).optional(),
  VERCEL_BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  FACEBOOK_GRAPH_ACCESS_TOKEN: process.env.FACEBOOK_GRAPH_ACCESS_TOKEN,
  VERCEL_BLOB_READ_WRITE_TOKEN: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
});

export type Env = typeof env;
