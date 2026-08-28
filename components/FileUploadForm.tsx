"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleSelectedFile = (selectedFile: File) => {
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create a local blob preview for images
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      addToast({
        title: "Upload Successful",
        description: `"${file.name}" uploaded to cloud storage`,
        color: "success",
      });

      clearFile();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error("Error uploading file:", err);
      const message = err.response?.data?.error || "Failed to upload file. Please try again.";
      setError(message);
      addToast({
        title: "Upload Failed",
        description: message,
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      addToast({
        title: "Invalid Folder Name",
        description: "Please enter a valid folder name.",
        color: "danger",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      addToast({
        title: "Folder Created",
        description: `Folder "${folderName}" created successfully`,
        color: "success",
      });

      setFolderName("");
      setFolderModalOpen(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error("Error creating folder:", err);
      addToast({
        title: "Creation Failed",
        description: err.response?.data?.error || "Could not create folder.",
        color: "danger",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action shortcuts */}
      <div className="flex gap-2">
        <Button
          color="primary"
          variant="flat"
          startContent={<FolderPlus className="h-4 w-4" />}
          onClick={() => setFolderModalOpen(true)}
          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
        >
          New Folder
        </Button>
        <Button
          color="primary"
          variant="solid"
          startContent={<FileUp className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 font-medium shadow-md shadow-primary/20"
        >
          Choose File
        </Button>
      </div>

      {/* Interactive Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          error
            ? "border-danger/40 bg-danger/5"
            : file
              ? "border-primary/50 bg-primary/5"
              : "border-zinc-800 hover:border-primary/40 bg-zinc-950/40 hover:bg-zinc-900/40"
        }`}
      >
        {!file ? (
          <div className="space-y-3 py-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Drag & drop your images here
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  browse from device
                </button>
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span>Supports JPG, PNG, GIF, WebP up to 5MB</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected File Card with Image Preview */}
            <div className="flex items-center gap-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-left">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-zinc-800 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-100 truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {file.size < 1024
                    ? `${file.size} B`
                    : file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              </div>

              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={clearFile}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="bg-danger/10 text-danger border border-danger/20 p-2.5 rounded-lg flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {uploading && (
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Uploading to CDN...</span>
                  <span className="font-mono text-primary font-medium">{progress}%</span>
                </div>
                <Progress
                  value={progress}
                  color="primary"
                  size="sm"
                  className="max-w-full"
                />
              </div>
            )}

            <Button
              color="primary"
              startContent={!uploading && <Upload className="h-4 w-4" />}
              endContent={!uploading && <ArrowRight className="h-4 w-4" />}
              onClick={handleUpload}
              isLoading={uploading}
              className="w-full font-medium shadow-md shadow-primary/20"
              isDisabled={!!error}
            >
              {uploading ? `Uploading... ${progress}%` : "Upload Image"}
            </Button>
          </div>
        )}
      </div>

      {/* Cloud features overview pills */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-medium text-zinc-300">Fast CDN Delivery</p>
            <p className="text-[10px] text-zinc-500">Instant edge cache</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-success flex-shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-medium text-zinc-300">Private & Secure</p>
            <p className="text-[10px] text-zinc-500">Encrypted token auth</p>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        backdrop="blur"
        classNames={{
          base: "border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-xl",
          header: "border-b border-zinc-800",
          footer: "border-t border-zinc-800",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <FolderPlus className="h-5 w-5 text-primary" />
            <span className="text-zinc-100">Create New Folder</span>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Organize your files by creating a new directory.
              </p>
              <Input
                type="text"
                label="Folder Name"
                placeholder="e.g. Travel Photos, Screenshots"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                variant="bordered"
                classNames={{
                  inputWrapper: "border-zinc-700 bg-zinc-900",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onClick={() => setFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateFolder}
              isLoading={creatingFolder}
              isDisabled={!folderName.trim()}
              endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
            >
              Create Folder
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
