import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico";

  if (isPublic) {
    return NextResponse.next();
  }

  const isLoggedIn = request.cookies.get("fj_session")?.value === "active";

  if (isLoggedIn) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!.*\\..*$).*)"],
};
