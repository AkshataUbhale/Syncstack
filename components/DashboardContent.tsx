"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { FileUp, FileText, User, Sparkles, HardDrive, Shield } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "@/components/UserProfile";
import { useSearchParams } from "next/navigation";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Set active tab based on URL parameter
  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  const displayName = userName
    ? userName.length > 12
      ? `${userName.substring(0, 12)}...`
      : userName.split(" ")[0]
    : "there";

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cloud Storage Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
              Welcome back, <span className="text-primary">{displayName}</span> 👋
            </h1>
            <p className="text-sm md:text-base text-zinc-400 mt-1">
              Manage, organize, and upload your cloud images with instant CDN delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
              <HardDrive className="h-4 w-4 text-primary" />
              <span>5MB Free Tier Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
              <Shield className="h-4 w-4 text-success" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        aria-label="Dashboard Tabs"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        classNames={{
          tabList: "gap-6 border-b border-zinc-800 pb-0",
          tab: "py-3 px-1 text-sm font-medium",
          cursor: "bg-primary h-0.5",
        }}
      >
        <Tab
          key="files"
          title={
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>My Storage</span>
            </div>
          }
        >
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upload Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <Card className="border border-zinc-800 bg-zinc-950/60 shadow-lg sticky top-24">
                <CardHeader className="flex gap-2.5 pb-2 border-b border-zinc-800/60">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <FileUp className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100">Upload Media</h3>
                </CardHeader>
                <CardBody className="pt-4">
                  <FileUploadForm
                    userId={userId}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardBody>
              </Card>
            </div>

            {/* Files Explorer */}
            <div className="lg:col-span-8 xl:col-span-9">
              <Card className="border border-zinc-800 bg-zinc-950/60 shadow-lg">
                <CardBody className="p-4 md:p-6">
                  <FileList
                    userId={userId}
                    refreshTrigger={refreshTrigger}
                    onFolderChange={handleFolderChange}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account & Profile</span>
            </div>
          }
        >
          <div className="mt-6 max-w-xl mx-auto">
            <UserProfile />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
