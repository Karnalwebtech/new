import { z } from "zod";

export const ProductCategoryDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  visibility: z.string().optional(),
});

export const ProductCollectionsDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  description: z.string().optional(),
});
