import {z} from "zod";
export const storeSchema = z.object({
  name: z.string().min(2).max(100),
  default_currency: z.string().length(3).optional(),
  default_region: z.string().length(2).optional(),
  default_sales_channel: z.string().length(2).optional(),
  default_location: z.string().length(2).optional(),
});