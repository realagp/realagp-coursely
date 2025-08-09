import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;
    const customerId = session.customer as string;

    if (!courseId || !userId) {
      console.error("Missing metadata in session");
      return new Response("Invalid metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        enrolleeId: customerId,
      },
    });

    if (!user || user.id !== userId) {
      console.error("User mismatch or not found");
      return new Response("User not found", { status: 400 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existing?.status === "Active") {
      return new Response("Already enrolled", { status: 200 });
    }

    // Fetch course title
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    // Perform update or create
    if (existing) {
      await prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          amount: session.amount_total ?? 0,
          status: "Active",
        },
      });
    } else {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
          amount: session.amount_total ?? 0,
          status: "Active",
        },
      });
    }

    // Get all admins
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
    });

    // Notify each admin
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        message: `${user.name} enrolled in "${course.title}"`,
      })),
    });
  }

  return new Response(null, { status: 200 });
}