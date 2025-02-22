import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/g"],
      disallow: [],
    },
    sitemap: "https://fipi.live/sitemap.xml",
  };
}
