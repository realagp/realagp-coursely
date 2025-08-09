"use server";

import { requireAdmin } from "@/app/data/admin/admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function deleteCourse(courseId: string): Promise<apiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: decision.reason.isRateLimit()
          ? "You've reached the maximum number of allowed requests."
          : "Access blocked due to potentially unsafe behavior.",
      };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        fileKey: true,
        chapter: {
          select: {
            lessons: {
              select: {
                thumbnailKey: true,
                videoKey: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // 2. Delete course image from S3 if exists
    if (course.fileKey) {
      await S3.send(
        new DeleteObjectCommand({
          Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
          Key: course.fileKey,
        })
      );
    }

    // 3. Delete thumbnailKey and videoKey from all lessons
    for (const chapter of course.chapter) {
      for (const lesson of chapter.lessons) {
        if (lesson.thumbnailKey) {
          await S3.send(
            new DeleteObjectCommand({
              Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
              Key: lesson.thumbnailKey,
            })
          );
        }

        if (lesson.videoKey) {
          await S3.send(
            new DeleteObjectCommand({
              Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES, // same shared bucket
              Key: lesson.videoKey,
            })
          );
        }
      }
    }

    // 4. Delete course from DB (cascade deletes chapters & lessons)
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/admin/courses/");

    return {
      status: "success",
      message: "Course and all associated files deleted successfully.",
    };
  } catch (err) {
    console.error("Error deleting course:", err);
    return {
      status: "error",
      message: "Something went wrong while deleting the course.",
    };
  }
}