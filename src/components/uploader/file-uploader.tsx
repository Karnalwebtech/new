"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Drag_input_field from "../files/drag-input-field";
import FilePreviewCard from "../files/file-preview-card";
import React from "react";

interface FileUploaderProps {
  title: string;
  field: string;
  handleDrop: (acceptedFiles: File[]) => void;
  handleDelete: (index: number) => void;
  imageitemData: {
    file: string; // URL or base64 string
    name: string;
    size: number;
    type: string;
  }[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title,
  field,
  handleDrop,
  handleDelete,
  imageitemData,
}) => {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {imageitemData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageitemData.map((item, i) => (
              <FilePreviewCard
                key={i}
                item={{
                  file: item.file, // Create a temporary URL for preview
                  name: item.name,
                  size: item.size,
                  type: item.type,
                }}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Drag_input_field onDrop={handleDrop} type={field} />
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(FileUploader);
