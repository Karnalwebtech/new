import { z } from "zod";

export const seoSchema = z.object({
  metaTitle: z.string({message:"Title are required"}).min(3, "SEO title must be at least 3 characters").max(60, "SEO title too long"),
  metaDescription: z.string({message:"Description are required"}).min(50, "Meta description must be at least 50 characters").max(160, "Meta description too long"),
  metaCanonicalUrl: z.string({message:"Url are required"}).regex(
    /^[a-zA-Z0-9-]+$/, // Allows letters, numbers, and hyphens
    "Only letters, numbers, and hyphens are allowed"
  ),
});

