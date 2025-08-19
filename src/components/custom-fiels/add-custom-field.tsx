"use client";
import CustomBtnPreview from "@/components/custom-fiels/custom-btn-preview";
import { customFields } from "@/types/custom-field-types";
import { useState } from "react";
import { useAddCustomFieldMutation } from "@/state/custom-field-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
// import React, { useState } from "react";
interface AddCustomFieldProps {
  pageId?: string;
  searchType?: string | null;
  storageFieldtype?: string | null;
}
const AddCustomField = ({ pageId = "policy-holder", searchType = "private", storageFieldtype }: AddCustomFieldProps) => {
  const [fields, setFields] = useState<customFields[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [addCustomField, { error, isSuccess, isLoading }] =
    useAddCustomFieldMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Field Added succesfuly.",
  });
  const handleSubmit = async () => {
    if (fields.length === 0) {
      alert("Please add at least one field");
      return;
    }

    // Validate fields
    for (const field of fields) {
      if (!field.label.trim()) {
        alert("All fields must have a label");
        return;
      }

      if (
        field.type === "dropdown" &&
        (!field.options || field.options.length < 1)
      ) {
        alert(`Dropdown field "${field.label}" must have at least one option`);
        return;
      }
    }
    const uniqueFields = fields.filter(
      (field, index, self) =>
        index ===
        self.findIndex(
          (f) => f.label.toLowerCase() === field.label.toLowerCase()
        )
    );
    const fieldsWithPage = uniqueFields.map((field) => ({
      ...field,
      page_id: pageId,
      search_type: searchType ?? undefined,
      field_type: storageFieldtype ?? undefined,
    }));
    try {
      await addCustomField(fieldsWithPage);
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form. Please try again.");
    }
  };

  return (
    <CustomBtnPreview
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleSubmit={handleSubmit}
      fields={fields}
      setFields={setFields}
      isLoading={isLoading}
    />
  );
};

export default AddCustomField;