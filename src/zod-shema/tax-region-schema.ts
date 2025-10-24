import { z } from "zod";

export const TaxRegionSchema = z.object({
  country: z
    .string({ required_error: "Country is required" }),
  tax_provider: z
    .string({ required_error: "Tax provider is required" }),
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 300 characters" }).optional(),
  tax_rate: z
  .string({
    required_error: "Tax rate is required",
    invalid_type_error: "Tax rate must be a string",
  })
  .regex(/^\d{1,3}$/, { message: "Tax rate must be 1 to 3 digits (only numbers)" })
  .refine(
    (val) => {
      const num = Number(val);
      return num >= 0 && num <= 100;
    },
    { message: "Tax rate must be between 0 and 100" }
  )
  .optional(),
      tax_code: z
    .string({ message: "Name is required" }).optional(),
  });

