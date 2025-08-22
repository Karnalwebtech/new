import { z } from "zod";

export const GoogleDriveFromSchema = z
  .object({
    auth_token_uri: z.string().url("auth_token_uri must be a valid URL"),
    auth_uri: z.string().url("auth_uri must be a valid URL"),
    auth_provider: z.string().min(1, "auth_provider is required"),
    universe_domain: z.string().min(1, "universe_domain is required"),
    client_id: z.string().min(1, "client_id is required"),
    client_cert_uri: z.string().url("client_cert_uri must be a valid URL"),
    storage_type: z.string().min(1, "storage_type is required"),
    client_email: z.string().email("client_email must be a valid email"),
    private_key: z.string().min(1, "private_key is required"),
    private_id_key: z.string().min(1, "private_id_key is required"),
    private_id: z.string().min(1, "private_id is required"),
    type: z.string().min(1, "type is required"),
    drive_folder: z.string().min(1, "drive_folder is required"),
    metadata_api: z.string().url("metadata_api must be a valid URL"),
    api: z.string().url("api must be a valid URL"),
  })
  .strict();

// export type GoogleDriveFrom = z.infer<typeof GoogleDriveFromSchema>;

// // Usage:
// // const data = /* incoming object */;
// // const parsed = GoogleDriveFromSchema.parse(data);
