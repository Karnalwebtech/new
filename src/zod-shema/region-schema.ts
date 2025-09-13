import { z } from "zod";

export const regionSchema = z.object({
  name: z
    .string({ required_error: "Region name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),

  currency: z.string({ required_error: "Currency is required" }),
  // .length(3, { message: "Currency must be a 3-letter ISO code" }), // e.g. INR, USD

  automatic_taxes: z.coerce.boolean().default(false),

  tax_inclusive_pricing: z.coerce.boolean().default(false),

  //   providers: z.array(z.string()),
});
