import {z} from "zod";
export const storeSchema = z.object({
  name: z.string().min(2).max(100),
  default_currency: z.string().optional(),
  default_region: z.string().optional(),
  default_sales_channel: z.string().optional(),
  default_location: z.string().optional(),
});