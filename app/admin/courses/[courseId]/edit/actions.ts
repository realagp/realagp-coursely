"use server";

import { requireAdmin } from "@/app/data/admin/admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/types";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/validations";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ConstructedUrl } from "@/hooks/object-url";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function UpdateCourse(data: CourseSchemaType, courseId: string): Promise<apiResponse> {
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

    const validation = await courseSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        stripeProductId: true,
        stripePriceId: true,
        price: true,
        userId: true,
      },
    });

    if (!course || course.userId !== session.user.id) {
      return {
        status: "error",
        message: "Course not found or unauthorized.",
      };
    }

    const existing = await prisma.course.findFirst({
      where: {
        slug: validation.data.slug,
        NOT: { id: courseId },
      },
    });

    if (existing) {
      return {
        status: "error",
        message: "Slug is already taken by another course.",
      };
    }

    await stripe.products.update(course.stripeProductId, {
      name: validation.data.title,
      description: validation.data.shortDescription,
      images: [ConstructedUrl(validation.data.fileKey)],
    });

    let updatedStripePriceId = course.stripePriceId;

    if (course.price !== validation.data.price) {
      const newPrice = await stripe.prices.create({
        currency: "php",
        unit_amount: validation.data.price * 100,
        product: course.stripeProductId,
      });
      updatedStripePriceId = newPrice.id;
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...validation.data,
        stripePriceId: updatedStripePriceId,
      },
    });

    const users = await prisma.user.findMany({
      where: { role: { not: "admin" } },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message: `The course "${validation.data.title}" was recently updated.`,
        type: "user",
      })),
    });

    return { status: "success", message: "Course updated successfully." };

  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong while updating the course.",
    };
  }
}

export async function reorderChapterLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<apiResponse> {
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "This chapter does not contain any lessons.",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson order updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "An error occurred while reordering. Please try again.",
    };
  }
}

export async function reorderCourseChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<apiResponse> {
  await requireAdmin();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "This course does not contain any chapters.",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter order updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "An error occurred while reordering. Please try again.",
    };
  }
}

export async function createChapter(values: ChapterSchemaType): Promise<apiResponse> {
  await requireAdmin();

  try {
    const validation = chapterSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: validation.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: validation.data.name,
          courseId: validation.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter added successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong while creating the chapter.",
    };
  }
}

export async function updateChapter(
  values: ChapterSchemaType & { chapterId: string }
): Promise<apiResponse> {
  await requireAdmin();

  try {
    const validation = chapterSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data.",
      };
    }

    await prisma.chapter.update({
      where: {
        id: values.chapterId,
      },
      data: {
        title: validation.data.name,
        courseId: validation.data.courseId,
      },
    });

    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong while updating the chapter.",
    };
  }
}

export async function createLesson(values: LessonSchemaType): Promise<apiResponse> {
  await requireAdmin();

  try {
    const validation = lessonSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: validation.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: validation.data.name,
          description: validation.data.description,
          chapterId: validation.data.chapterId,
          thumbnailKey: validation.data.thumbnailKey,
          videoKey: validation.data.videoKey,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson added successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong while creating the lesson.",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<apiResponse> {
  await requireAdmin();

  try {
    const lessonData = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        thumbnailKey: true,
        videoKey: true,
      },
    });

    const deleteCommands = [];

    if (lessonData?.thumbnailKey) {
      deleteCommands.push(
        S3.send(
          new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: lessonData.thumbnailKey,
          })
        )
      );
    }

    if (lessonData?.videoKey) {
      deleteCommands.push(
        S3.send(
          new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: lessonData.videoKey,
          })
        )
      );
    }

    await Promise.all(deleteCommands);

    const validChapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!validChapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    const lessons = validChapter.lessons;

    const deleteLesson = lessons.find((lesson) => lesson.id === lessonId);

    if (!deleteLesson) {
      return {
        status: "error",
        message: "Lesson not found.",
      };
    }

    const activeLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = activeLessons.map((lesson, position) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: position + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId, chapterId: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson and associated files deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong while deleting the lesson.",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<apiResponse> {
  await requireAdmin();

  try {
    const lessonsToDelete = await prisma.lesson.findMany({
      where: {
        chapterId,
      },
      select: {
        thumbnailKey: true,
        videoKey: true,
      },
    });

    const deleteCommands = lessonsToDelete.flatMap((lesson) => {
      const cmds = [];
      if (lesson.thumbnailKey) {
        cmds.push(
          S3.send(
            new DeleteObjectCommand({
              Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
              Key: lesson.thumbnailKey,
            })
          )
        );
      }
      if (lesson.videoKey) {
        cmds.push(
          S3.send(
            new DeleteObjectCommand({
              Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
              Key: lesson.videoKey,
            })
          )
        );
      }
      return cmds;
    });

    await Promise.all(deleteCommands);

    const validCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapter: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!validCourse) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    const chapters = validCourse.chapter;
    const deleteChapter = chapters.find((ch) => ch.id === chapterId);

    if (!deleteChapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    const remainingChapters = chapters.filter((ch) => ch.id !== chapterId);

    const updates = remainingChapters.map((ch, position) =>
      prisma.chapter.update({
        where: { id: ch.id },
        data: { position: position + 1 },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: { id: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter and lesson files deleted successfully.",
    };
  } catch (error) {
    console.error("deleteChapter error:", error);
    return {
      status: "error",
      message: "Something went wrong while deleting the chapter.",
    };
  }
}
