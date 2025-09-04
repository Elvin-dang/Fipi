import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fipi.live",
      lastModified: new Date(),
    },
  ];
}
