import { z } from "zod";

export const seoSchema = z.object({
  meta_title: z.string({message:"Title are required"}).min(3, "SEO title must be at least 3 characters").max(60, "SEO title too long"),
  meta_description: z.string({message:"Description are required"}).min(50, "Meta description must be at least 50 characters").max(160, "Meta description too long"),
  meta_canonical_url: z.string({message:"Url are required"}).regex(
    /^[a-zA-Z0-9-]+$/, // Allows letters, numbers, and hyphens
    "Only letters, numbers, and hyphens are allowed"
  ),
});

