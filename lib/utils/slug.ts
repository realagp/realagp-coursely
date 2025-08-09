import slugify from "slugify";

export const generateSlug = (title: string) =>
  slugify(title, { lower: true, strict: true });