import { z } from "zod";

export const serviceZoneSchema = z.object({
  name: z
    .string({ required_error: "Region name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),
});
