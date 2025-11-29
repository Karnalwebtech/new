import { z } from "zod";

export const MailingListSchema = z.object({
  name: z.string({ message: "Name are required" }).min(3, "Name must be at least 3 characters").max(100, "Name too long"),
  description: z.string({ message: "Description are required" }).min(10, "Description too short").max(300, "Description too long"),
  doubleOptIn: z.boolean().optional(),       // Optional field
  welcomeEmail: z.boolean().optional(),      // Optional field
  applyToAllSubscribers: z.boolean().optional(),      // Optional field
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format",
    }),
});
