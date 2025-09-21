import { z } from "zod";

export const apiKeySchema = z.object({
  name: z
    .string({ required_error: "API Key name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),
});
