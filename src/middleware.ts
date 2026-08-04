import { NextResponse, type NextRequest } from "next/server";

import type { Locale } from "@/generated/locale-catalogs";
import {
  defaultLocale,
  getLocaleByPrefix,
  getLocalizedPath,
  isLocale,
  localeDefinitions,
  resolvePreferredLocale,
} from "@/lib/locale-routing";

function requestHeaders(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set("x-battle-poker-locale", locale);
  return headers;
}

function legacyRoomRequest(pathname: string) {
  for (const definition of localeDefinitions) {
    if (!definition.urlPrefix) continue;
    const prefix = `/${definition.urlPrefix}`;
    if (pathname === `${prefix}/room` || pathname.startsWith(`${prefix}/room/`)) {
      return { locale: definition.id, target: pathname.slice(prefix.length) || "/room" };
    }
  }
  return undefined;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const acceptLanguage = request.headers.get("accept-language");
  const legacyRoom = legacyRoomRequest(pathname);

  if (legacyRoom) {
    const response = NextResponse.redirect(new URL(legacyRoom.target, request.url));
    response.cookies.set("NEXT_LOCALE", legacyRoom.locale, {
      path: "/",
      maxAge: 31_536_000,
      sameSite: "lax",
    });
    return response;
  }

  if (pathname === "/") {
    const preferredLocale = resolvePreferredLocale(cookieLocale, acceptLanguage);
    if (preferredLocale !== defaultLocale) {
      return NextResponse.redirect(new URL(getLocalizedPath(preferredLocale, "home"), request.url));
    }
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const prefixedLocale = getLocaleByPrefix(firstSegment);
  const isRoom = pathname === "/room" || pathname.startsWith("/room/");
  const locale = isRoom
    ? resolvePreferredLocale(cookieLocale, acceptLanguage)
    : prefixedLocale ?? defaultLocale;

  const response = NextResponse.next({ request: { headers: requestHeaders(request, locale) } });
  if (!isRoom && pathname !== "/" && isLocale(locale) && cookieLocale !== locale) {
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31_536_000, sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
