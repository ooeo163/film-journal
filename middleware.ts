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

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get("fj_user_role")?.value;

  if (pathname === "/admin" || pathname.startsWith("/admin/users")) {
    if (role !== "system_admin") {
      return NextResponse.redirect(new URL("/admin/photos", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*$).*)"],
};
