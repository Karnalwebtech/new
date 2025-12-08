import { z } from "zod";

export const InventorySchema = z
  .object({
    // Basic info
    title: z.string().min(1, "Title is required"),
    sku: z.string().trim().min(0).optional().or(z.literal("")),

    description: z.string().min(0).optional(),
    requires_shipping: z.boolean().optional().default(false),
    width: z.coerce
      .number()
      .optional()
      .refine((v) => v === undefined || v >= 0, {
        message: "Width must be >= 0",
      }),
    length: z.coerce
      .number()
      .optional()
      .refine((v) => v === undefined || v >= 0, {
        message: "Length must be >= 0",
      }),
    height: z.coerce
      .number()
      .optional()
      .refine((v) => v === undefined || v >= 0, {
        message: "Height must be >= 0",
      }),
    weight: z.coerce
      .number()
      .optional()
      .refine((v) => v === undefined || v >= 0, {
        message: "Weight must be >= 0",
      }),

    // Codes
    mid_code: z.string().trim().optional().or(z.literal("")),
    hs_code: z.string().trim().optional().or(z.literal("")),

    country: z.string().trim().optional().or(z.literal("")),

    material: z.string().trim().optional().or(z.literal("")),
  })
  .strict();
