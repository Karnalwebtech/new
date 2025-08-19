import { Label } from "@/components/ui/label";
import InputField from "../fields/input-field";
import Text_Editor_field from "../fields/text-editor";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";

interface PostFormProps<T extends FieldValues> {
  control: Control<T>; // Type-safe control from useForm
  setValue: UseFormSetValue<T>; // Correctly typed setValue
  errors: FieldErrors<T>; // Typed errors
}
export function PostForm<T extends FieldValues>({
  control,
  setValue,
  errors,
}: PostFormProps<T>) {
  return (
    <>
      <div className="my-4">
        <InputField
          control={control}
          errors={errors}
          name={"title" as Path<T>}
          label={"Enter post title"}
          inputStyle={
            "text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
          }
        />
      </div>
      <div className="my-4">
        <InputField
          control={control}
          errors={errors}
          name={"downloadurl" as Path<T>}
          label={"Enter file download URL"}
          placeholder="Optional"
          inputStyle={
            "text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
          }
        />
      </div>
      <div className="my-4">
        <InputField
          control={control}
          errors={errors}
          name={"description" as Path<T>}
          label={"Enter post description"}
          inputStyle={
            "text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
          }
        />
      </div>
      <div className="my-4">
        <Label htmlFor={"Content"} className="text-gray-200">
          Content
        </Label>
        <Text_Editor_field
          control={control}
          errors={errors}
          name={"content" as Path<T>}
          setValue={setValue}
        />
      </div>
    </>
  );
}
