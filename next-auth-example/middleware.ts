import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import {
  determineLogout,
  isPublicRoute,
  withAuth,
  withoutAuth,
} from "./lib/services/guard.service";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const logout = await determineLogout(req);

  if (isPublicRoute(req.url)) {
    return withoutAuth(logout, req.url);
  }

  return withAuth(logout, req.url);
}
