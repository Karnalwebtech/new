import { z } from "zod";

export const salesChannelsSchema = z.object({
  name: z
    .string({ required_error: "Sales channels name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),
    description: z
    .string({ required_error: "Description is required" })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(300, { message: "Description must be at most 300 characters" }),
  enabled: z.coerce.boolean().default(false),

});
