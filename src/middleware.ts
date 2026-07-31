import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const preference = request.cookies.get("NEXT_LOCALE")?.value;
    const browserLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

    if (preference === "en" || (!preference && browserLanguage.startsWith("en"))) {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-battle-poker-locale",
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR",
  );

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
