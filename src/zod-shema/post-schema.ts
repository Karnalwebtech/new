import { z } from "zod";

export const postSchema = z.object({
  title: z.string({ message: "Title are required" }).min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string({ message: "Description are required" }).min(10, "Description too short").max(300, "Description too long"),
  downloadurl: z.string().nullable().optional(),
  content: z
    .string({ message: "Content are required" })
    .min(10, "Content is too short"),
  // category: z.string().min(2, "Category is required"),
  // tags: z.array(z.string().min(2, "Tag too short")).nonempty("At least one tag is required"),
  status: z.string({ message: "Status are required" }),
});
