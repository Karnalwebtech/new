
import UploadFile from "@/modules/dashboard/file-manager/upload-file/upload-file";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Upload Files",
  description: "Upload Files",
};
export default function page() {
  return <UploadFile />;
}
