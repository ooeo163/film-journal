import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fj_user_id")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (!user || user.role !== "system_admin") {
    return null;
  }

  return user;
}
