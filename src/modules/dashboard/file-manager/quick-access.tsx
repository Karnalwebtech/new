"use client";
import {
  Video,
  Image,
  Download,
  FileArchiveIcon as FileZip,
} from "lucide-react";
import NavigateBtn from "../../../components/buttons/navigate-btn";

export function QuickAccess() {
  const items = [
    {
      icon: Video,
      label: "Videos",
      path: "/dashboard/file-manager/video",
    },
    {
      icon: Image,
      label: "Images",
      path: "/dashboard/file-manager/image",
    },
    {
      icon: Download,
      label: "PDF",
      path: "/dashboard/file-manager/document",
    },
    {
      icon: FileZip,
      label: "Zip File",
      path: "/dashboard/file-manager/archive",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Access</h2>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:grid-cols-8">
        {items.map((item) => (
          <NavigateBtn
            key={item.label}
            title={item.label}
            Icon={item.icon}
            path={item.path}
            style={
              "flex h-20 md:h-24 w-full flex-col items-center justify-center gap-2 bg-gray-50 border"
            }
          />
        ))}
      </div>
    </div>
  );
}
