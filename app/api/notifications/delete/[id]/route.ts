import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifiedUser } from "@/app/data/user/verified-user";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {

  const { id } = await params;
  
  try {
    const session = await verifiedUser();

    const deleted = await prisma.notification.deleteMany({
      where: {
        id,
        userId: session.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /notifications/delete]", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete notification." },
      { status: 500 }
    );
  }
}
