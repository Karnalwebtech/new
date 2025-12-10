import { z } from "zod";

export const ReservationsSchema = z
  .object({
    // Basic info
    reserve: z.string().min(1, "Reserve is required"),
    location: z.string().min(1, "Stock location is required"),
    description: z.string().min(0).optional(),
    quantity: z.coerce
      .number()
      .optional()
      .refine((v) => v === undefined || v >= 0, {
        message: "Width must be >= 0",
      }),
  })
  .strict();
