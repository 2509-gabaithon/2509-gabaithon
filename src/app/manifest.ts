import type { MetadataRoute } from "next";
import icon from "../../public/icon.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ユ活",
    short_name: "ユ活",
    description: "ユ活の説明",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff", // スプラッシュスクリーンの背景色
    theme_color: "#f7a5a5",
    icons: [
      {
        src: icon.src,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: icon.src,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
