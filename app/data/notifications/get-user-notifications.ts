"use server";

import { prisma } from "@/lib/db";
import { verifiedUser } from "../user/verified-user";

// Define the type based on your `notification` table structure
export type Notification = {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  deleted: boolean;
  createdAt: Date;
};

export async function getUserNotifications(): Promise<Notification[]> {
  
  const user = await verifiedUser();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return notifications;
}