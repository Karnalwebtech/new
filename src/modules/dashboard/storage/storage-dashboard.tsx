"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileManager } from "./file-manager";
import { AccessControl } from "./access-control";
import { Header } from "./header";
import { StorageOverview } from "./storage-overview";
import { StorageSettings } from "./storage-settings";
import Link from "next/link";

export function StorageDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header />
      <div>
        <h2 className="text-lg font-bold">
          Unlock Free Cloud Storage: Google Drive, Firebase Storage, and More
        </h2>
        <p>
          In today&apos;s digital world, cloud storage is essential for managing
          data, media files, and backups. Several platforms offer free storage
          options that cater to different needs. <Link className="text-blue-800" href={"/blog"}>Read more</Link>:
        </p>
      </div>
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <StorageOverview />
        </TabsContent>
        <TabsContent value="files" className="space-y-4">
          <FileManager />
        </TabsContent>
        <TabsContent value="sharing" className="space-y-4">
          <AccessControl />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <StorageSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
