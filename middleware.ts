import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/api/auth/login", "/api/auth/logout"];

function getOrigin(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}

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

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", getOrigin(request));
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get("fj_user_role")?.value;

  if (pathname.startsWith("/admin") && role !== "system_admin") {
    return NextResponse.redirect(new URL("/", getOrigin(request)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*$).*)"],
};
