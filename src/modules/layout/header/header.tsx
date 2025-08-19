"use client"
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { sidebarToggle } from "@/reducers/healper-slice";
interface HeaderProps {
  breadcrumbData: { label: string; path: string }[];
}
export const Header = ({ breadcrumbData }: HeaderProps) => {
  const dispatch = useDispatch();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger onClick={() => dispatch(sidebarToggle())} className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbData.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbData.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage> // Last item as text
                  ) : (
                    <Link href={item.path}>
                      {item.label}
                    </Link> // Others as links
                  )}
                </BreadcrumbItem>
                {index < breadcrumbData.length - 1 && <BreadcrumbSeparator />}{" "}
                {/* Separator between items */}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
