"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Key,
  Mail,
  Folder,
  Database,
} from "lucide-react";
import InputField from "@/components/fields/input-field";
import {
  Control,
  FieldErrors,
  Path,
  FieldValues,
} from "react-hook-form";

// Ensure T extends FieldValues, which is the expected type for form data
interface InputFieldProps<T extends FieldValues> {
  control: Control<T>; // The form control
  errors: FieldErrors<T>; // The form errors
}
const GoogleDriveForm = <T extends FieldValues>({
  control,
  errors,
}: InputFieldProps<T>) => {
  const [storageType, setStorageType] = useState("google-drive");
  const [customFields, setCustomFields] = useState<string[]>([]);

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      `Custom Field ${customFields.length + 1}`,
    ]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };
  return (
    <div className="mt-4">
      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Authentication
          </h3>

          <div className="space-y-2">
            <Label htmlFor="client-cert-uri" className="text-sm font-medium">
              Client Cert URI
            </Label>
            <InputField
              name={"client_cert_uri" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-token-uri" className="text-sm font-medium">
              Auth Token URI
            </Label>
            <InputField
              name={"auth_token_uri" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-id" className="text-sm font-medium">
              Client ID
            </Label>
            <InputField
              name={"client_id" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-key" className="text-sm font-medium">
              Private Key
            </Label>
            <InputField
              name={"private_key" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-id" className="text-sm font-medium">
              Private ID
            </Label>
            <InputField
              name={"private_id" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>
        </div>

        {/* Configuration Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Configuration
          </h3>

          <div className="space-y-2">
            <Label htmlFor="auth-provider" className="text-sm font-medium">
              Auth Provider
            </Label>
            <InputField
              name={"auth_provider" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-uri" className="text-sm font-medium">
              Auth URI
            </Label>
            <InputField
              name={"auth_uri" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="client-email"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Mail className="h-3 w-3" />
              Client Email
            </Label>
            <InputField
              name={"client_email" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-id-key" className="text-sm font-medium">
              Private ID Key
            </Label>
            <InputField
              name={"private_id_key" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <InputField
              name={"type" as Path<T>} // Ensure name is of type Path<T>
              type={"text"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div className="space-y-4 mt-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Folder className="h-4 w-4 text-primary" />
          Storage Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="drive-folder" className="text-sm font-medium">
              Drive Folder
            </Label>
            <InputField
              name={"drive_folder" as Path<T>} // Ensure name is of type Path<T>
              type={"type"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="metadata-api"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Database className="h-3 w-3" />
              Metadata API
            </Label>
            <InputField
              name={"metadata_api" as Path<T>} // Ensure name is of type Path<T>
              type={"type"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api" className="text-sm font-medium">
              API Endpoint
            </Label>
            <InputField
              name={"api" as Path<T>} // Ensure name is of type Path<T>
              type={"type"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universe_domain" className="text-sm font-medium">
              Universe domain
            </Label>
            <InputField
              name={"universe_domain" as Path<T>} // Ensure name is of type Path<T>
              type={"type"}
              placeholder="Enter auth token URI"
              inputStyle="h-10 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              control={control} // Replace with actual control from react-hook-form
              errors={errors} // Replace with actual errors from react-hook-form
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveForm;
