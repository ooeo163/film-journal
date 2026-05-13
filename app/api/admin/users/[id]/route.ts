import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireAdmin } from "@/lib/require-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();

  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const password = String(formData.get("password") || "");
  const isActive = formData.get("isActive") === "on";

  if (!username || !email) {
    return NextResponse.json(
      { error: "用户名和邮箱为必填项" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const duplicateUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
      NOT: { id },
    },
  });

  if (duplicateUser) {
    return NextResponse.json(
      { error: "用户名或邮箱已被使用" },
      { status: 409 }
    );
  }

  try {
    const updateData: Record<string, unknown> = {
      username,
      email,
      displayName: displayName || username,
      role: role || "user",
      isActive,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/users?updated=1`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "update-failed",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  if (id === admin.id) {
    return NextResponse.json(
      { error: "不能删除当前登录的管理员账号" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: "/admin/users?deleted=1",
    });
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : "delete-failed", },
      { status: 400 }
    );
  }
}
