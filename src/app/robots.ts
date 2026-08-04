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
        "/artigos/",
        "/en",
        "/en/faq",
        "/en/what-is-planning-poker",
        "/en/articles/",
      ],
      disallow: ["/room/", "/en/room/", "/api/", "/admin/", "/_vercel/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
