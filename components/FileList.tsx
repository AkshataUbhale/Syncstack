"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Folder,
  Star,
  Trash,
  X,
  ExternalLink,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { formatDistanceToNow, format } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import axios from "axios";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";
import FileGridView from "@/components/FileGridView";
import ImageLightboxModal from "@/components/ImageLightboxModal";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileType | null>(null);

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      addToast({
        title: "Error Loading Files",
        description: "We couldn't load your files. Please try again later.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch files when userId, refreshTrigger, or currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // Filter files based on active tab and search query
  const filteredFiles = useMemo(() => {
    let result = files;

    switch (activeTab) {
      case "starred":
        result = files.filter((file) => file.isStarred && !file.isTrash);
        break;
      case "trash":
        result = files.filter((file) => file.isTrash);
        break;
      case "all":
      default:
        result = files.filter((file) => !file.isTrash);
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((file) => file.name.toLowerCase().includes(q));
    }

    return result;
  }, [files, activeTab, searchQuery]);

  // Count files in trash
  const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash).length;
  }, [files]);

  // Count starred files
  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash).length;
  }, [files]);

  const handleStarFile = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: file?.isStarred ? "Removed from Starred" : "Added to Starred",
        description: `"${file?.name}" has been ${
          file?.isStarred ? "removed from" : "added to"
        } your starred files`,
        color: "success",
      });
    } catch (error) {
      console.error("Error starring file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the star status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleTrashFile = async (fileId: string) => {
    try {
      const response = await axios.patch(`/api/files/${fileId}/trash`);
      const responseData = response.data;

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isTrash: !file.isTrash } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      addToast({
        title: responseData.isTrash ? "Moved to Trash" : "Restored from Trash",
        description: `"${file?.name}" has been ${
          responseData.isTrash ? "moved to trash" : "restored"
        }`,
        color: "success",
      });
    } catch (error) {
      console.error("Error trashing file:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the file status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const fileToDelete = files.find((f) => f.id === fileId);
      const fileName = fileToDelete?.name || "File";

      const response = await axios.delete(`/api/files/${fileId}/delete`);

      if (response.data.success) {
        setFiles(files.filter((file) => file.id !== fileId));
        addToast({
          title: "File Permanently Deleted",
          description: `"${fileName}" has been permanently removed`,
          color: "success",
        });
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      addToast({
        title: "Deletion Failed",
        description: "We couldn't delete the file. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);
      setFiles(files.filter((file) => !file.isTrash));
      addToast({
        title: "Trash Emptied",
        description: `All ${trashCount} items have been permanently deleted`,
        color: "success",
      });
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      addToast({
        title: "Action Failed",
        description: "We couldn't empty the trash. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      addToast({
        title: "Preparing Download",
        description: `Getting "${file.name}" ready for download...`,
        color: "primary",
      });

      const downloadUrl = file.type.startsWith("image/")
        ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`
        : file.fileUrl;

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download response not OK");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      addToast({
        title: "Download Started",
        description: `"${file.name}" is downloading`,
        color: "success",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      addToast({
        title: "Download Failed",
        description: "Could not download file. Please try again.",
        color: "danger",
      });
    }
  };

  // Open Lightbox or Navigate to Folder
  const handleItemClick = (file: FileType) => {
    if (file.isFolder) {
      navigateToFolder(file.id, file.name);
    } else {
      setPreviewFile(file);
      setLightboxOpen(true);
    }
  };

  // Folder navigation helpers
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
    if (onFolderChange) onFolderChange(folderId);
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      const newFolderId =
        newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolder(newFolderId);
      if (onFolderChange) onFolderChange(newFolderId);
    }
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);
      if (onFolderChange) onFolderChange(null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      setCurrentFolder(newFolderId);
      if (onFolderChange) onFolderChange(newFolderId);
    }
  };

  if (loading) {
    return <FileLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          files={files}
          starredCount={starredCount}
          trashCount={trashCount}
        />

        {/* View Mode & Search */}
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="h-4 w-4 text-zinc-400" />}
            isClearable
            onClear={() => setSearchQuery("")}
            className="w-48 sm:w-60"
          />

          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <Tooltip content="Grid View">
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "grid" ? "solid" : "light"}
                color={viewMode === "grid" ? "primary" : "default"}
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 min-w-7"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </Tooltip>

            <Tooltip content="Table View">
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "table" ? "solid" : "light"}
                color={viewMode === "table" ? "primary" : "default"}
                onClick={() => setViewMode("table")}
                className="h-7 w-7 min-w-7"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Folder Breadcrumb Navigation */}
      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      {/* Action buttons (Refresh & Empty Trash) */}
      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      <Divider className="my-2 border-zinc-800" />

      {/* Main Files Display */}
      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : viewMode === "grid" ? (
        /* Rich Grid View */
        <FileGridView
          files={filteredFiles}
          onItemClick={handleItemClick}
          onStar={handleStarFile}
          onTrash={handleTrashFile}
          onDelete={(file) => {
            setSelectedFile(file);
            setDeleteModalOpen(true);
          }}
          onDownload={handleDownloadFile}
        />
      ) : (
        /* Detailed Table View */
        <Card
          shadow="sm"
          className="border border-zinc-800 bg-zinc-950/60 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table
              aria-label="Files table"
              isStriped
              color="default"
              selectionMode="none"
              classNames={{
                base: "min-w-full",
                th: "bg-zinc-900/90 text-zinc-300 font-medium text-xs border-b border-zinc-800 py-3",
                td: "py-3 border-b border-zinc-900 text-sm",
              }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn className="hidden sm:table-cell">Type</TableColumn>
                <TableColumn className="hidden md:table-cell">Size</TableColumn>
                <TableColumn className="hidden sm:table-cell">Added</TableColumn>
                <TableColumn width={240}>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className="hover:bg-zinc-900/80 transition-colors cursor-pointer"
                    onClick={() => handleItemClick(file)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileIcon file={file} />
                        <div>
                          <div className="font-medium flex items-center gap-2 text-zinc-100">
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {file.name}
                            </span>
                            {file.isStarred && (
                              <Tooltip content="Starred">
                                <Star
                                  className="h-3.5 w-3.5 text-yellow-400"
                                  fill="currentColor"
                                />
                              </Tooltip>
                            )}
                            {file.isFolder && (
                              <Tooltip content="Folder">
                                <Folder className="h-3 w-3 text-zinc-400" />
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 sm:hidden">
                            {formatDistanceToNow(new Date(file.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs font-mono text-zinc-400">
                        {file.isFolder ? "Folder" : file.type}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-zinc-300 text-xs">
                        {file.isFolder
                          ? "-"
                          : file.size < 1024
                            ? `${file.size} B`
                            : file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-zinc-300 text-xs">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {format(new Date(file.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <FileActions
                        file={file}
                        onStar={handleStarFile}
                        onTrash={handleTrashFile}
                        onDelete={(file) => {
                          setSelectedFile(file);
                          setDeleteModalOpen(true);
                        }}
                        onDownload={handleDownloadFile}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* In-App Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onOpenChange={setLightboxOpen}
        file={previewFile}
        onStar={handleStarFile}
        onTrash={handleTrashFile}
        onDownload={handleDownloadFile}
      />

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description="Are you sure you want to permanently delete this file?"
        icon={X}
        iconColor="text-danger"
        confirmText="Delete Permanently"
        confirmColor="danger"
        onConfirm={() => {
          if (selectedFile) handleDeleteFile(selectedFile.id);
        }}
        isDangerous={true}
        warningMessage={`You are about to permanently delete "${selectedFile?.name}". This file will be removed from your cloud account and cannot be recovered.`}
      />

      {/* Empty trash confirmation modal */}
      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description="Are you sure you want to empty the trash?"
        icon={Trash}
        iconColor="text-danger"
        confirmText="Empty Trash"
        confirmColor="danger"
        onConfirm={handleEmptyTrash}
        isDangerous={true}
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash.`}
      />
    </div>
  );
}
