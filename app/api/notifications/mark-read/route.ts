import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifiedUser } from "@/app/data/user/verified-user";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
  }

  const session = await verifiedUser();
  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.notification.updateMany({
      where: {
        id,
        userId: session.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mark-read] error:", error);
    return NextResponse.json({ error: "Error updating notification" }, { status: 500 });
  }
}
