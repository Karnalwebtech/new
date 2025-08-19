import { z } from "zod";

export const fileFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  caption: z.string().min(5, "Caption must be at least 5 characters").max(200, "Caption is too long"),
  altText: z.string().min(3, "Alt text must be at least 3 characters").max(150, "Alt text is too long"),
  width: z
  .coerce.number()
  .min(1, "Width is required")
  .refine((val) => val > 0, {
    message: "Width must be a number greater than 0",
  }),
height: z
  .coerce.number()
  .min(1, "Height is required")
  .refine((val) => val > 0, {
    message: "Height must be a number greater than 0",
  }),
  signature: z.string().optional(), // Optional field
});
