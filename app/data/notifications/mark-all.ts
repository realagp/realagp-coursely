"use server";

import { prisma } from "@/lib/db";
import { verifiedUser } from "../user/verified-user";

export async function markAllNotificationsAsRead() {
  const session = await verifiedUser();

  await prisma.notification.updateMany({
    where: {
      userId: session.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return { status: "success" };
}