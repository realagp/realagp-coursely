"use server";

import { verifiedUser } from "@/app/data/user/verified-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { apiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  })
);

export async function enrollmentProcess(courseId: string): Promise<apiResponse | never> {
  const user = await verifiedUser();
  let checkoutUrl: string;

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Access suspended due to unusual activity. Try again shortly.",
        };
      }
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        price: true,
        slug: true,
        stripePriceId: true,
        stripeProductId: true,
      },
    });

    if (!course || !course.stripePriceId) {
      return {
        status: "error",
        message: "This course is not available for purchase at the moment.",
      };
    }

    let enrolleeId: string;

    const userWithEnrolleeId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        enrolleeId: true,
      },
    });

    if (userWithEnrolleeId?.enrolleeId) {
      enrolleeId = userWithEnrolleeId.enrolleeId;
    } else {
      const newEnrollee = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      enrolleeId = newEnrollee.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          enrolleeId: enrolleeId,
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: enrolleeId,
      line_items: [
        {
          price: course.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.BETTER_AUTH_URL}/payment/success`,
      cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        productId: course.stripeProductId,
      },
    });

    checkoutUrl = checkoutSession.url as string;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeAPIError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later.",
      };
    }

    return {
      status: "error",
      message: "Course enrollment failed.",
    };
  }

  redirect(checkoutUrl);
}