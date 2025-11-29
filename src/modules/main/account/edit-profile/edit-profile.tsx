"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import InputField from "@/components/fields/input-field";
import { profileSchema } from "@/zod-schema/profile-schema";
import SelectFields from "@/components/fields/select-field";
import { Upload } from "lucide-react";
import type { RootState } from "@/store";
import LazyImage from "@/components/LazyImage";
import {
  close,
  open,
  setCategory,
  setMaxLimit,
  setTypeid,
} from "@/reducers/healper-slice";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import FileLoader from "@/components/files/file-loader/file-loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateProfileMutation } from "@/state/profile-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { GeneralBtn } from "@/components/buttons/general-btn";
import { setUser } from "@/reducers/auth-slice";

type ProfileFormValues = z.infer<typeof profileSchema>;

interface FieldConfig {
  id: number;
  name: keyof ProfileFormValues;
  type: "text" | "email" | "date" | "number" | "textarea" | "dropdown";
  label: string;
  placeholder: string;
}

export const EditProfile = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.helper.isOpen);
  const user = useSelector((state: RootState) => state?.user);
  const fileData = useSelector((state: RootState) => state.files.files);
  const [updateProfile, { error, isLoading, isSuccess }] =
    useUpdateProfileMutation();

  useHandleNotifications({
    error: error,
    isSuccess: isSuccess,
    successMessage: "Profile updated",
    redirectPath: "/dashboard/account",
  });
  const fieldConfig: FieldConfig[] = [
    {
      id: 1,
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "Enter name",
    },
    {
      id: 2,
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter email",
    },
    {
      id: 3,
      name: "bio",
      type: "textarea",
      label: "Bio",
      placeholder: "Enter bio",
    },
    {
      id: 4,
      name: "dateOfBirth",
      type: "date",
      label: "Date Of Birth",
      placeholder: "Enter Date Of Birth",
    },
    {
      id: 5,
      name: "phone",
      type: "number",
      label: "Phone",
      placeholder: "Enter Phone",
    },
    {
      id: 6,
      name: "gender",
      type: "dropdown",
      label: "Gender",
      placeholder: "Select Gender",
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user?.name || "",
      email: user?.user?.email || "",
      bio: user?.user?.bio || "",
      dateOfBirth: user?.user?.dateOfBirth || "",
      phone: user?.user?.phone ? Number(user?.user?.phone) : undefined,
      gender: user?.user?.gender || "",
    },
  });

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      const updatedData = {
        name: values?.name || "",
        dateOfBirth: values?.dateOfBirth || "",
        email: values?.email || "",
        bio: values?.bio || "",
        phone: values?.phone ? Number(values?.phone) : undefined,
        gender: values?.gender || "",
      };
      const response = await updateProfile({
        ...updatedData,
        profile_image: fileData?.[0]?._id,
      }).unwrap();
      if (response.success) {
        dispatch(setUser({ user: response.result, token: user?.token || "" }));
      }
    },
    [updateProfile, fileData, dispatch, user]
  );

  const handleClose = useCallback(() => {
    dispatch(close());
  }, [dispatch]);

  const handleImageUpload = useCallback(() => {
    dispatch(open());
    dispatch(setTypeid("profile_image"));
    dispatch(setMaxLimit(1));
    dispatch(setCategory("image"));
  }, [dispatch]);

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
            drop_down_selector={[
              { key: "male", value: "male" },
              { key: "female", value: "female" },
              { key: "other", value: "other" },
            ]}
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
        />
      );
    },
    [control, errors]
  );

  const profileImage = fileData?.[0]?.public_id;

  return (
    <div className="p-2 lg:p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-8">
          {/* Profile Image */}
          <CardContent className="p-2 lg:p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="overflow-hidden rounded-full border-4 border-primary/50">
                <LazyImage
                  src={profileImage?profileImage:user?.user?.profile_image
                    ? user?.user?.profile_image?.public_id
                    : ""}
                  style="w-[130px] h-[130px] bg-gray-800"
                  alt="Profile image"
                />
              </div>
              <button
                type="button"
                onClick={handleImageUpload}
                className="flex items-center gap-2 text-sm text-primary"
              >
                <Upload className="h-4 w-4" />
                <span>Upload new image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {fieldConfig.map(renderField)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <GeneralBtn
              title={"Update Profile"}
              loader={isLoading}
              isIcon={true}
              type={"submit"}
              style={"w-[150px]"}
            />
          </CardFooter>
        </form>
      </Card>

      <DrawerComponent
        title="Upload Profile Image"
        description="Select an image to use as your profile picture"
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <FileLoader />
      </DrawerComponent>
    </div>
  );
};
