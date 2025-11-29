import { z } from "zod";

export const ReturnReasonSchema = z.object({
  value: z
    .string({ required_error: "Return reason value is required" })
    .min(2, { message: "Value must be at least 2 characters" })
    .max(100, { message: "Value must be at most 100 characters" })
    .transform((val) => val.trim().replace(/\s+/g, "_").toLowerCase()),
  label: z
    .string({ required_error: "Return reason label is required" })
    .min(2, { message: "Label must be at least 2 characters" })
    .max(100, { message: "Label must be at most 100 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(300, { message: "Description must be at most 300 characters" }),
});
