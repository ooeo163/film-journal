import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

function sanitizeRedirect(value: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/albums";
  }
  return value;
}

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
  const redirectTo = sanitizeRedirect(
    typeof formData.get("redirectTo") === "string"
      ? String(formData.get("redirectTo"))
      : "",
  );

  const user = identifier
    ? await prisma.user.findFirst({
        where: {
          isActive: true,
          OR: [{ username: identifier }, { email: identifier }],
        },
      })
    : null;

  const valid = user?.password ? await verifyPassword(password, user.password) : false;

  if (!user || !valid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    loginUrl.searchParams.set("error", "invalid-credentials");
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
