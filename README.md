## Agentic Krishna Reels

Autonomous pipeline that scripts, voices, renders, uploads, and (optionally) posts 10–15 second Krishna motivation reels to Instagram. Built on Next.js App Router and deployable to Vercel.

### Features

- Curated Bhagavad Gita quote bank with OpenAI-enhanced hooks, narration, and CTA.
- Text-to-speech via `gpt-4o-mini-tts` with 432hz ambience mixing (fallback to instrumental only if no TTS key).
- ffmpeg-driven 9:16 render with kinetic subtitles and brand accent overlays.
- Upload to Vercel Blob for public distribution and hand-off to Instagram Graph API.
- One-click Instagram autopost (requires valid business account + access token).

### Environment Variables

Create an `.env.local` file with the following keys:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | recommended | Script writing + voice-over generation |
| `UNSPLASH_ACCESS_KEY` | optional | Fetch fresh devotional backdrops |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | optional | Upload finished reels for download/posting |
| `FACEBOOK_GRAPH_ACCESS_TOKEN` | optional | Required for Instagram autopost |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | optional | Target Instagram business account |

> Without the optional tokens, the UI still renders reels locally and logs the pipeline, but upload/post steps are skipped.

### Local Development

1. Install dependencies  
   `npm install`

2. Run the dev server  
   `npm run dev`

3. Open `http://localhost:3000` and launch the automation. Pipeline logs, download link, and caption appear in the “Automation Console”.

### Production Build

- `npm run build` — compile production assets
- `npm run start` — serve the production bundle

### Deployment

This project is tailored for Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-a9636809
```

Make sure the environment variables are configured in the Vercel dashboard (or supplied via `vercel env pull`) before deploying so that the automation can upload/post reels in production.

### Instagram Graph Automation Notes

- Only Instagram Business accounts linked to a Facebook Page may post via the Graph API.
- The provided access token must carry `instagram_content_publish` permission.
- Video URLs must be publicly accessible (Vercel Blob handles this when the token is set).
- The automation polls container status and surfaces errors directly in the UI log stream.

### Extending the Pipeline

- Add more curated quotes in `lib/quotes.ts`.
- Swap narration voices by modifying the `voice` default in `app/components/automation-client.tsx`.
- Customize renders by editing `lib/video.ts` for new overlays/filters.
- Integrate a scheduler by enqueueing multiple `runAutomation` calls via your preferred queue system. 
