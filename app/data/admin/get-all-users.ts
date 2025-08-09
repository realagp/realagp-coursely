import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./admin";

export async function getUsers() {

    await requireAdmin();

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      enrolleeId: true,
      role: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export type UserTable = Awaited<ReturnType<typeof getUsers>>[number];