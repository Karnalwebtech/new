import { z } from "zod";

export const TemplateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  type: z.enum(["email", "whatsapp", "sms"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
});
