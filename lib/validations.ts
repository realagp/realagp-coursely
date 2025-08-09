import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = [
  "Information Technology",
  "Computer Science",
  "Business & Management",
  "Health & Medicine",
  "Arts & Humanities",
  "Science & Engineering",
  "Social Sciences",
  "Education & Teaching",
  "Personal Development",
  "Data Science",
  "Language Learning"
] as const;

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, {message: "Title must be at least 3 characters long."})
        .max(100, {message: "Title cannot exceed 100 characters."}),
    shortDescription: z
        .string()
        .min(10, {message: "Short description must be at least 10 characters long."})
        .max(200, {message: "Short description cannot exceed 200 characters."}),
    description: z
        .string()
        .min(30, {message: "Description must be at least 30 characters long."}),
    fileKey: z
        .string()
        .min(1, {message: "File key is required."}),
    price: z
        .coerce.number()
        .min(1)
        .nonnegative({message: "Invalid price. Price must be a positive number."}),
    duration: z
        .coerce.number()
        .min(1)
        .max(500, {message: "Duration must be between 1 and 500 hours."}),
    level: z
        .enum(courseLevels, {message: "Course level is required."}),
    category: z
        .enum(courseCategories, {message: "Course category is required."}),
    status: z
        .enum(courseStatus, {message: "Course status is required."}),
    slug: z
        .string()
        .min(1, {message: "Generate slug from title."}),
});

export const chapterSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name must be at least 3 characters long."}),
    courseId: z
        .string().uuid({message: "Invalid course ID."})
});

export const lessonSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name must be at least 3 characters long."}),
    courseId: z
        .string().uuid({message: "Invalid course ID."}),
    chapterId: z
        .string().uuid({message: "Invalid chapter ID."}),
    description: z
        .string()
        .min(3, {message: "Description must be at least 30 characters long."})
        .optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;