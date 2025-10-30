import { z } from "zod";

export const stockLocationSchema = z
  .object({
    // Required Fields
    name: z
      .string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a string.",
      })
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name must not exceed 100 characters.")
      .trim(),

    country: z
      .string({
        required_error: "Country is required.",
      })
      .min(1, "Country is required.")
      .trim(),

    // Optional Fields with validation
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[0-9]{7,15}$/, {
        message: "Phone number must contain only digits and may start with +.",
      })
      .optional(),

    address_1: z
      .string()
      .min(5, "Address 1 must be at least 5 characters long.")
      .max(200, "Address 1 must not exceed 200 characters.")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),

    address_2: z
      .string()
            .min(5, "Address 2 must be at least 5 characters long.")
      .max(200, "Address 2 must not exceed 200 characters.")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),

    company: z
      .string()
            .min(5, "Company name must be at least 5 characters long.")
      .max(150, "Company name must not exceed 150 characters.")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),

    postal_code: z
      .string()
      .regex(/^[A-Za-z0-9\s-]{3,10}$/, {
        message: "Postal code should be alphanumeric and 3–10 characters long.",
      })
      .optional(),

    state: z
      .string()
       .min(5, "State name must be at least 5 characters long.")
      .max(100, "State name must not exceed 100 characters.")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),

    city: z
      .string()
      .min(5, "City name must be at least 5 characters long.")
      .max(100, "City name must not exceed 100 characters.")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),
  })
  // Conditional rules
  .refine(
    (data) => {
      // If address_2 is provided, address_1 must exist
      if (data.address_2 && !data.address_1) return false;
      return true;
    },
    {
      message: "Address 1 is required when Address 2 is provided.",
      path: ["address_1"],
    }
  );
