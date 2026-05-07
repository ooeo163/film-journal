import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username =
    typeof formData.get("username") === "string"
      ? String(formData.get("username")).trim()
      : "";
  const email =
    typeof formData.get("email") === "string"
      ? String(formData.get("email")).trim()
      : "";
  const displayName =
    typeof formData.get("displayName") === "string"
      ? String(formData.get("displayName")).trim()
      : "";
  const password =
    typeof formData.get("password") === "string"
      ? String(formData.get("password"))
      : "";

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "用户名、邮箱和密码为必填项" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "用户名或邮箱已被使用" },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      displayName: displayName || username,
      password: hashedPassword,
      role: "user",
    },
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  });
}

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
