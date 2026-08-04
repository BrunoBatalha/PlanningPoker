import { NextResponse, type NextRequest } from "next/server";
import articleSlugs from "@/generated/article-slugs.json";

const publishedArticleSlugs = articleSlugs as Record<"pt-BR" | "en", string[]>;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-battle-poker-locale",
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR",
  );

  const portugueseArticle = pathname.match(/^\/artigos\/([^/]+)\/?$/);
  const englishArticle = pathname.match(/^\/en\/articles\/([^/]+)\/?$/);
  const unknownArticle =
    (portugueseArticle && !publishedArticleSlugs["pt-BR"].includes(portugueseArticle[1])) ||
    (englishArticle && !publishedArticleSlugs.en.includes(englishArticle[1]));

  if (unknownArticle) {
    return NextResponse.rewrite(new URL("/404", request.url), {
      status: 404,
      request: { headers: requestHeaders },
    });
  }

  if (pathname === "/") {
    const preference = request.cookies.get("NEXT_LOCALE")?.value;
    const browserLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

    if (preference === "en" || (!preference && browserLanguage.startsWith("en"))) {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
