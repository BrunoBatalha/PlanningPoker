import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/faq",
        "/o-que-e-planning-poker",
        "/en",
        "/en/faq",
        "/en/what-is-planning-poker",
      ],
      disallow: ["/room/", "/en/room/", "/api/", "/admin/", "/_vercel/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
