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

export const ProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().optional(),
  description: z.string().optional(),
});

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

