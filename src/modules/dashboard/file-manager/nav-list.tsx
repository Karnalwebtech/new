"use client";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { Home, Files, Clock, Trash2, CloudUpload } from "lucide-react";
import React, { memo, useMemo } from "react";
const NAV_ITEMS = [
  { title: "Home", Icon: Home, path: "/dashboard/file-manager" },
  {
    title: "Upload File",
    Icon: CloudUpload,
    path: "/dashboard/file-manager/upload-file",
  },
  { title: "All", Icon: Files, path: "/dashboard/file-manager/all" },
  {
    title: "Recent",
    Icon: Clock,
    path: "/dashboard/file-manager/recent",
    disabled: true,
  },
  {
    title: "Deleted",
    Icon: Trash2,
    path: "/dashboard/file-manager/deleted",
    disabled: true,
  },
];
interface NavListProps {
  style?: string;
}
const NavList = ({ style }: NavListProps) => {
  const navButtons = useMemo(
    () =>
      NAV_ITEMS.map(({ title, Icon, path, disabled }) => (
        <NavigateBtn
          style={style}
          key={path}
          title={title}
          Icon={Icon}
          path={path}
          disabled={disabled}
        />
      )),
    [style]
  );
  return <div className="space-y-1">{navButtons}</div>;
};

export default memo(NavList);
