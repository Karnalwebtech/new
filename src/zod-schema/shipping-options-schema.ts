import { z } from "zod";
export const shippingOptionSchema = z.object({
  name: z.string({ message: "This field is required" }).min(2).max(100),
  shipping_profile: z.string({ message: "This field is required" }),
  fulfillment_provider: z.string({ message: "This field is required" }),
  fulfillment_option: z.string({ message: "This field is required" }),
  enabled_in_store: z.boolean({ message: "This field is required" }),
});
