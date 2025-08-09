"use server";

import { prisma } from "@/lib/db";
import { verifiedUser } from "../user/verified-user";

export async function deleteNotification(notificationId: string) {
  try {
    const session = await verifiedUser();

    const deleted = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: session.id,
      },
    });

    if (deleted.count === 0) {
      return { status: "not_found" };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[deleteNotification] error:", error);
    return { status: "error", message: "Failed to delete notification." };
  }
}
