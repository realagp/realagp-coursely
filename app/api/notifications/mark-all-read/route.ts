import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifiedUser } from "@/app/data/user/verified-user";

export async function POST() {
    
  const session = await verifiedUser();

  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mark-all-read] error:", error);
    return NextResponse.json({ error: "Error updating notifications" }, { status: 500 });
  }
}