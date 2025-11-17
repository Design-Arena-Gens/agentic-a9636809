import axios from "axios";
import { env } from "./env";

export type InstagramPublishResult =
  | {
      status: "skipped";
      reason: string;
    }
  | {
      status: "success";
      mediaId: string;
      permalink: string | null;
    };

const GRAPH_BASE = "https://graph.facebook.com/v18.0";

export async function publishReelToInstagram({
  videoUrl,
  caption,
}: {
  videoUrl: string;
  caption: string;
}): Promise<InstagramPublishResult> {
  if (
    !env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
    !env.FACEBOOK_GRAPH_ACCESS_TOKEN
  ) {
    return {
      status: "skipped",
      reason:
        "Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or FACEBOOK_GRAPH_ACCESS_TOKEN",
    };
  }

  const igId = env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = env.FACEBOOK_GRAPH_ACCESS_TOKEN;

  const container = await axios
    .post(
      `${GRAPH_BASE}/${igId}/media`,
      {
        media_type: "REELS",
        video_url: videoUrl,
        caption,
        share_to_feed: true,
      },
      {
        params: {
          access_token: token,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(
        `Failed to create Instagram media container: ${getErrorMessage(error)}`,
      );
    });

  const creationId = container.id;

  await waitForContainerReady(creationId, token);

  const publish = await axios
    .post(
      `${GRAPH_BASE}/${igId}/media_publish`,
      {
        creation_id: creationId,
      },
      {
        params: {
          access_token: token,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(
        `Failed to publish Instagram reel: ${getErrorMessage(error)}`,
      );
    });

  const mediaId = publish.id;
  const permalink = await fetchPermalink(mediaId, token);

  return {
    status: "success",
    mediaId,
    permalink,
  };
}

async function waitForContainerReady(creationId: string, token: string) {
  const maxAttempts = 12;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await axios
      .get(
        `${GRAPH_BASE}/${creationId}`,
        {
          params: {
            fields: "status_code,status",
            access_token: token,
          },
        },
      )
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(
          `Failed to poll container status: ${getErrorMessage(error)}`,
        );
      });

    if (status.status_code === "FINISHED") {
      return;
    }

    if (status.status_code === "ERROR") {
      throw new Error("Instagram container failed to finish processing");
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error(
    "Timed out while waiting for Instagram container to finish processing",
  );
}

async function fetchPermalink(mediaId: string, token: string) {
  try {
    const { permalink } = await axios
      .get(`${GRAPH_BASE}/${mediaId}`, {
        params: {
          fields: "permalink",
          access_token: token,
        },
      })
      .then((res) => res.data);
    return permalink ?? null;
  } catch (error) {
    console.error("Failed to fetch Instagram permalink", error);
    return null;
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) {
      return data.error.message;
    }
  }
  return (error as Error)?.message ?? "Unknown error";
}
