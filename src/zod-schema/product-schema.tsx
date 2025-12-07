import { z } from "zod";
import { seoSchema } from "./seo-schema";

export const ProductCategoryDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_internal: z.boolean().default(false),
  has_parent: z.boolean().default(false),
});

export const ProductCollectionsDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  description: z.string().optional(),
});

export const ProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  tags: z.string().optional(),
  type: z.string().optional(),
  collection: z.string().optional(),
  shipping_profile: z.string().optional(),
  description: z.string().optional(),
  hasVariants: z.boolean().default(false),
}).merge(seoSchema.partial());

export const productTypeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(300, { message: "Description must be at most 300 characters" }),
});
export const productTagchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(300, { message: "Description must be at most 300 characters" }),
});
