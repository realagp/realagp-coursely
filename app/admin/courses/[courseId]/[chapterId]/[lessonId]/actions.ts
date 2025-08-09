"use server";

import { requireAdmin } from "@/app/data/admin/admin";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/validations";

export async function ConfigureLesson(
  lessonId: string,
  values: LessonSchemaType
): Promise<apiResponse> {
  await requireAdmin();

  try {
    const validation = lessonSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    // 🧠 Get the courseId via related Chapter
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        title: true,
        Chapter: {
          select: {
            courseId: true,
            title: true,
            Course: {
              select: {
                title: true,
              }
            }
          },
        },
      },
    });

    const courseId = lesson?.Chapter?.courseId;
    const lessonTitle = lesson?.title
    const chapterTitle = lesson?.Chapter?.title;
    const courseTitle = lesson?.Chapter?.Course?.title;

    if (!courseId) {
      return {
        status: "error",
        message: "Unable to determine course for this lesson.",
      };
    }

    // ✅ Update the lesson
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: validation.data.name,
        description: validation.data.description,
        thumbnailKey: validation.data.thumbnailKey,
        videoKey: validation.data.videoKey,
      },
    });

    // ✅ Notify all *active* enrolled non-admin users
    const enrolledUsers = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "Active",
        User: {
          role: { not: "admin" },
        },
      },
      select: {
        userId: true,
      },
    });

    if (enrolledUsers.length > 0) {
      await prisma.notification.createMany({
        data: enrolledUsers.map((enrollment) => ({
          userId: enrollment.userId,
          message: `The lesson "${lessonTitle}" in chapter "${chapterTitle}" of "${courseTitle}" has been updated.`,
          type: "user",
        })),
      });
    }

    return {
      status: "success",
      message: "Lesson updated and users notified successfully.",
    };
  } catch (error) {
    console.error("ConfigureLesson error:", error); // helpful during dev
    return {
      status: "error",
      message: "Something went wrong while configuring the lesson.",
    };
  }
}