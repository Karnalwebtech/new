import { z } from "zod";

export const contactsSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Name must only contain letters, numbers, and spaces",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, {
      message: "Phone number must be digits only (7 to 15 digits)",
    })
    .optional(),
  status: z.enum(["active", "inactive"]).optional(),
//   tags: z.array(z.string()).optional(), // include this
});

