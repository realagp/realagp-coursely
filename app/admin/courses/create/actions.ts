"use server";

import { requireAdmin } from "@/app/data/admin/admin";
import { ConstructedUrl } from "@/hooks/object-url";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { apiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/validations";
import { request } from "@arcjet/next";
import { generateSlug } from "@/lib/utils/slug";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function CreateNewCourse(
  values: CourseSchemaType
): Promise<apiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You've reached the maximum number of allowed requests.",
        };
      } else {
        return {
          status: "error",
          message: "Access blocked due to potentially unsafe behavior.",
        };
      }
    }

    const validation = await courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const slug = generateSlug(validation.data.slug || validation.data.title);

    const existing = await prisma.course.findUnique({
      where: { slug },
    });

    if (existing) {
      return {
        status: "error",
        message: "A course with a similar title already exists.",
      };
    }

    const stripeProduct = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.shortDescription,
      default_price_data: {
        currency: "php",
        unit_amount: validation.data.price * 100,
      },
      images: [ConstructedUrl(validation.data.fileKey)],
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        slug,
        userId: session?.user.id as string,
        stripePriceId: stripeProduct.default_price as string,
        stripeProductId: stripeProduct.id,
        fileKey: validation.data.fileKey,
      },
    });

    // Notify all non-admin users
    const users = await prisma.user.findMany({
      where: {
        role: { not: "admin" },
      },
      select: {
        id: true,
      },
    });

    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message: `A new course "${validation.data.title}" has been published.`,
        type: "user",
      })),
    });

    return {
      status: "success",
      message: "Course created successfully.",
    };
  } catch (error: any) {
    return {
      status: "error",
      message:
        error?.message || "Something went wrong while creating the course.",
    };
  }
}