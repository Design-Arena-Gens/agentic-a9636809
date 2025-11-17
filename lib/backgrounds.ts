import axios from "axios";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { env } from "./env";
import { createTempId } from "./utils";

type BackgroundResult = {
  path: string;
  attribution: string | null;
};

const LOCAL_BACKGROUNDS = [
  "public/backgrounds/krishna-1.jpg",
  "public/backgrounds/krishna-2.jpg",
  "public/backgrounds/gradient-1.png",
  "public/backgrounds/gradient-2.png",
];

export async function fetchBackgroundImage(
  query: string,
): Promise<BackgroundResult> {
  if (env.UNSPLASH_ACCESS_KEY) {
    try {
      const { data } = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          params: {
            query,
            orientation: "portrait",
            content_filter: "high",
          },
          headers: {
            Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
            "Accept-Version": "v1",
          },
        },
      );

      const imageUrl = data.urls?.regular || data.urls?.full;
      if (imageUrl) {
        const response = await axios.get<ArrayBuffer>(imageUrl, {
          responseType: "arraybuffer",
        });
        const filePath = path.join(
          os.tmpdir(),
          `${createTempId("bg")}.${getExtension(imageUrl)}`,
        );
        await fs.writeFile(filePath, Buffer.from(response.data));
        return {
          path: filePath,
          attribution:
            data.user?.name && data.links?.html
              ? `${data.user.name} / Unsplash`
              : null,
        };
      }
    } catch (error) {
      console.error("Failed to source Unsplash background", error);
    }
  }

  const chosen =
    LOCAL_BACKGROUNDS[Math.floor(Math.random() * LOCAL_BACKGROUNDS.length)];
  const absolute = path.join(process.cwd(), chosen);
  return {
    path: absolute,
    attribution: null,
  };
}

function getExtension(url: string) {
  const fromPath = path.extname(new URL(url).pathname);
  return fromPath ? fromPath.replace(".", "") : "jpg";
}
