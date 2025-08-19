"use client";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputField from "@/components/fields/input-field";
import SelectFields from "@/components/fields/select-field";
import { socialProfileSchema } from "@/zod-shema/social-profile-schema";
import { SocialProfileForm } from "@/types/social-profile-type";
import { useAddSocialProfileMutation, useUpdateSocialProfileMutation } from "@/state/social-profile-api";
import { GeneralBtn } from "@/components/buttons/general-btn";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import SocialProfileList from "./social-profile-list";

const options = [
  { key: "facebook", value: "facebook" },
  { key: "github", value: "github" },
  { key: "instagram", value: "instagram" },
  { key: "linkedin", value: "linkedin" },
  { key: "twitter", value: "twitter" },
  { key: "youtube", value: "youtube" },
  { key: "snapchat", value: "snapchat" },
  { key: "tiktok", value: "tiktok" },
  { key: "pinterest", value: "pinterest" },
  { key: "reddit", value: "reddit" },
  { key: "discord", value: "discord" },
  { key: "telegram", value: "telegram" },
  { key: "whatsapp", value: "whatsapp" },
];
interface FieldConfig {
  id: number;
  name: keyof SocialProfileForm;
  type: "text" | "email" | "date" | "number" | "textarea" | "dropdown";
  label: string;
  placeholder: string;
}
const fieldConfig: FieldConfig[] = [
  {
    id: 1,
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter title",
  },
  {
    id: 2,
    name: "platform",
    type: "dropdown",
    label: "Platform",
    placeholder: "Enter platform",
  },
  {
    id: 3,
    name: "url",
    type: "text",
    label: "URL",
    placeholder: "Enter URL",
  },
];

export default function SocialProfile() {
  const [addSocialProfile, { error, isLoading, isSuccess }] = useAddSocialProfileMutation()
  const [updateSocialProfile, { error: UpdateError, isLoading: UpdateIsLoading, isSuccess: UpdateIsSuccess }] = useUpdateSocialProfileMutation()
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  useHandleNotifications({
    error: error || UpdateError,
    isSuccess: isSuccess || UpdateIsSuccess,
    successMessage: isSuccess ? "Social Profile update succesfuly." : "Social Profile update succesfuly.",
  });
  // Initialize the form
  const {
    control,
    handleSubmit, reset,
    formState: { errors },
  } = useForm<SocialProfileForm>({
    resolver: zodResolver(socialProfileSchema),
  });

  // Handle form submission
  const onSubmit = useCallback(async (values: SocialProfileForm) => {
    if (isEditing) {
      await updateSocialProfile({ ...values, id: isEditing })
      setIsFormOpen(false);
      setIsEditing(null);
      reset();
      return
    }
    await addSocialProfile(values)
    setIsFormOpen(false);
    setIsEditing(null);
    reset();
  }, [addSocialProfile, isEditing, reset, updateSocialProfile])


  const renderField = useCallback(
    (field: FieldConfig) => {
      if (field.type === "dropdown") {
        return (
          <SelectFields
            key={field.id}
            control={control}
            errors={errors}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            drop_down_selector={options}
          />
        );
      }

      return (
        <InputField
          key={field.id}
          control={control}
          errors={errors}
          label={field.label}
          disabled_path={field.type === "email"}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
        />
      );
    },
    [control, errors]
  );

  return (
    <div className="container mx-auto p-2 lg:p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold">Social Profiles</h1>
          <p className="text-muted-foreground">
            Manage your online presence across platforms
          </p>
        </div>
        <Button
          onClick={() => {
            reset({title:""})
            setIsEditing(null);
            setIsFormOpen(!isFormOpen);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Profile
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Social Profile" : "Add New Social Profile"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your existing social profile information"
                : "Connect a new social media profile or website"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6">
                {fieldConfig.map(renderField)}
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setIsEditing(null);
                    reset()
                  }}
                >
                  Cancel
                </Button>
                <GeneralBtn
                  title={isEditing ? "Update Profile" : "Add Profile"}
                  loader={isLoading || UpdateIsLoading}
                  isIcon={true}
                  type={"submit"}
                  style="w-[150px]"
                />

              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <SocialProfileList setIsFormOpen={setIsFormOpen} setIsEditing={setIsEditing} reset={reset} />
      </div>
    </div>
  );
}
