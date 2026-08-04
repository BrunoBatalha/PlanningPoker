import type { MetadataRoute } from "next";

import { getLocalizedPath, localeDefinitions, locales } from "@/lib/locale-routing";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const publicPaths = locales.flatMap((locale) => [
    getLocalizedPath(locale, "home") || "/",
    getLocalizedPath(locale, "guide"),
    getLocalizedPath(locale, "faq"),
    `${getLocalizedPath(locale, "articles")}/`,
  ]);
  const legacyRoomPaths = localeDefinitions
    .filter((definition) => definition.urlPrefix)
    .map((definition) => `/${definition.urlPrefix}/room/`);

  return {
    rules: {
      userAgent: "*",
      allow: [...new Set(publicPaths)],
      disallow: ["/room/", ...legacyRoomPaths, "/api/", "/admin/", "/_vercel/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
