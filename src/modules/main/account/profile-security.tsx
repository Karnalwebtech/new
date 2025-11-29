import { GeneralBtn } from "@/components/buttons/general-btn";
import InputField from "@/components/fields/input-field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useChangePasswordMutation } from "@/state/profile-api";
import { ChangePasswordForm } from "@/types/profile-types";
import { changePasswordSchema } from "@/zod-schema/profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
interface FieldConfig {
  id: number;
  name: keyof ChangePasswordForm;
  type: "text" | "email" | "date" | "number" | "textarea" | "dropdown" | "password";
  label: string;
  placeholder: string;
}


const fieldConfig: FieldConfig[] = [
  {
    id: 1,
    name: "c_password",
    type: "password",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    id: 2,
    name: "n_password",
    type: "password",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    id: 3,
    name: "cn_password",
    type: "password",
    label: "Confirm New Password",
    placeholder: "Enter confirm new password",
  },
];

export function ProfileSecurity() {
  const [changePassword, { error, isLoading, isSuccess }] = useChangePasswordMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Password change succesfuly.",
  });
  const {
    control,
    handleSubmit, reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });


  // Handle form submission
  const onSubmit = useCallback(async (values: ChangePasswordForm) => {
    const response = await changePassword(values);
    
    if (response?.data?.success) {
      reset();
    }
  }, [reset, changePassword])

  const renderField = useCallback(
    (field: FieldConfig) => {
      if (field.type === "password") {
        return (
          <InputField
            key={field.id}
            control={control}
            errors={errors}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
          />
        );
      }

    },
    [control, errors]
  );
  // changePasswordSchema
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {fieldConfig.map(renderField)}
          </CardContent>
          <CardFooter>
            <GeneralBtn
              title={"Change password"}
              loader={isLoading}
              isIcon={true}
              type={"submit"}
              style="w-[180px]"
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

