import { z } from "zod";

export const ShippingProfileSchema = z.object({
  name: z
    .string({ required_error: "Shipping profile name is required" })
    .min(2, { message: "name must be at least 2 characters" })
    .max(100, { message: "name must be at most 100 characters" }),
  type: z
    .string({ required_error: "Shipping profile type is required" })
    .min(2, { message: "type must be at least 2 characters" })
    .max(100, { message: "type must be at most 100 characters" }),
});


export const ShippingOptionTypeSchema = z.object({
  name: z
    .string({ required_error: "Shipping option type name is required" })
    .min(2, { message: "name must be at least 2 characters" })
    .max(100, { message: "name must be at most 100 characters" }),
  code: z
    .string({ required_error: "Shipping option type code is required" })
    .min(2, { message: "Code must be at least 2 characters" })
    .max(100, { message: "Code must be at most 100 characters" }),
     description: z
    .string({ required_error: "Shipping option type description is required" })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(200, { message: "Description must be at most 100 characters" }),
});
