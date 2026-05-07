import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const identifier =
    typeof formData.get("identifier") === "string"
      ? String(formData.get("identifier")).trim()
      : "";
  const password =
    typeof formData.get("password") === "string"
      ? String(formData.get("password"))
      : "";
  const redirectTo =
    typeof formData.get("redirectTo") === "string" && formData.get("redirectTo")
      ? String(formData.get("redirectTo"))
      : "/albums";

  const user = identifier
    ? await prisma.user.findFirst({
        where: {
          isActive: true,
          OR: [{ username: identifier }, { email: identifier }],
        },
      })
    : null;

  if (!user || !user.password) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    loginUrl.searchParams.set("error", "user-not-found");
    return NextResponse.redirect(loginUrl);
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    loginUrl.searchParams.set("error", "wrong-password");
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set("fj_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("fj_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("fj_user_name", user.displayName, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("fj_user_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
