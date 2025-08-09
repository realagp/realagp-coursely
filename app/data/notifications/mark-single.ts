"use server";

import { prisma } from "@/lib/db";
import { verifiedUser } from "../user/verified-user";

export async function markNotificationAsRead(notificationId: string) {
  const session = await verifiedUser();

    await prisma.notification.updateMany({
    where: {
        id: notificationId,
        userId: session.id,
        isRead: false, // 👈 use 'isRead' here
    },
    data: {
        isRead: true,
    },
    });

  return { status: "success" };
}