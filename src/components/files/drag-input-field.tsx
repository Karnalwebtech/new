import React from "react";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";

// Define the type for the onDrop function prop
interface DragInputFieldProps {
  onDrop: (acceptedFiles: File[]) => void;
  type?: string;
  color_class?: string;
}
const validMimeTypes: Accept = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  "application/pdf": [".pdf"],
  "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  "application/zip": [".zip", ".rar", ".7z"],
};

// Combine all accepted file types
const acceptedFormats: Accept = {
  "image/*": validMimeTypes["image/*"],
  "application/pdf": validMimeTypes["application/pdf"],
  "video/*": validMimeTypes["video/*"],
  "application/zip": validMimeTypes["application/zip"],
};
const Drag_input_field: React.FC<DragInputFieldProps> = ({
  onDrop,
  //   type = "image/*",
  color_class = "black",
}) => {
  // Configure dropzone options
  // const accept: Accept = type in validMimeTypes ? { [type]: validMimeTypes[type] } : { "image/*": validMimeTypes["image/*"] };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: acceptedFormats,
    multiple: true, // Allow multiple files
  };

  // Use the dropzone hook
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div>
      <div
        {...getRootProps({
          className: `dropzone px-6 md:px-10 py-16 border-dashed border-1 rounded-xl cursor-pointer border-${color_class} bg-red`,
        })}
        // style={{ border: `1px solid ${color_class}`, margin: '0px 0 10px' }}
      >
        <input {...getInputProps()} />{" "}
        <p className={`text-${color_class}`}>
          Drag &apos n drop some files here, or click to select files
        </p>
        {/* Display accepted file types dynamically */}
        <p className="mt-4 text-sm text-gray-500">
          Accepted file types: Images (.png, .jpg, .jpeg, .gif, .webp), PDFs,
          Videos (.mp4, .mov, .avi, .mkv, .webm), Zip (.zip, .rar, .7z)
        </p>
      </div>
    </div>
  );
};

export default React.memo(Drag_input_field);
