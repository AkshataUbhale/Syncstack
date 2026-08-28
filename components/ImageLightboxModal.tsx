"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";
import {
  Download,
  Copy,
  Check,
  Star,
  ExternalLink,
  Trash,
  Info,
  Calendar,
  HardDrive,
  FileType as FileTypeIcon,
  Maximize2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType | null;
  onStar?: (fileId: string) => void;
  onTrash?: (fileId: string) => void;
  onDownload?: (file: FileType) => void;
}

export default function ImageLightboxModal({
  isOpen,
  onOpenChange,
  file,
  onStar,
  onTrash,
  onDownload,
}: ImageLightboxModalProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!file) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(file.fileUrl);
      setCopied(true);
      addToast({
        title: "Link Copied",
        description: "Direct image URL copied to clipboard",
        color: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard",
        color: "danger",
      });
    }
  };

  const formattedSize =
    file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  // High-res transformed ImageKit preview URL
  const highResUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}/tr:q-95,w-1920,h-1440,fo-auto/${file.path}`;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl max-h-[92vh]",
        header: "border-b border-zinc-800/80 px-6 py-4",
        body: "p-0 overflow-hidden",
        footer: "border-t border-zinc-800/80 px-6 py-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-zinc-100 truncate">
                    {file.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Added {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Action Icons in Header */}
              <div className="flex items-center gap-1.5 flex-shrink-0 mr-6">
                <Tooltip content={file.isStarred ? "Remove Star" : "Star Image"}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className={file.isStarred ? "text-yellow-400 bg-yellow-400/10" : "text-zinc-400 hover:text-white"}
                    onClick={() => onStar && onStar(file.id)}
                  >
                    <Star className="h-4 w-4" fill={file.isStarred ? "currentColor" : "none"} />
                  </Button>
                </Tooltip>

                <Tooltip content="Toggle File Details">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className={showDetails ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-white"}
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Tooltip content="Open Original in New Tab">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => window.open(file.fileUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </ModalHeader>

            <ModalBody className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[68vh]">
                {/* Main Image Container */}
                <div
                  className={`relative flex items-center justify-center p-4 bg-zinc-900/50 min-h-[350px] lg:min-h-[500px] transition-all duration-300 ${
                    showDetails ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <img
                    src={file.type.startsWith("image/") ? highResUrl : file.fileUrl}
                    alt={file.name}
                    className="max-h-[62vh] max-w-full object-contain rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>

                {/* Optional Metadata Sidebar */}
                {showDetails && (
                  <div className="lg:col-span-4 p-6 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-950/80 space-y-6 overflow-y-auto">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                        File Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <HardDrive className="h-3.5 w-3.5" /> File Size
                          </span>
                          <span className="text-zinc-200 font-medium">{formattedSize}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <FileTypeIcon className="h-3.5 w-3.5" /> Type
                          </span>
                          <span className="text-zinc-200 font-mono text-xs">{file.type}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                          <span className="text-zinc-400 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" /> Uploaded
                          </span>
                          <span className="text-zinc-200 text-xs">
                            {format(new Date(file.createdAt), "MMM d, yyyy h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Direct CDN Link
                      </h4>
                      <div className="flex items-center gap-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                        <input
                          type="text"
                          readOnly
                          value={file.fileUrl}
                          className="bg-transparent text-xs text-zinc-300 w-full truncate focus:outline-none"
                        />
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          color={copied ? "success" : "default"}
                          onClick={handleCopyLink}
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  startContent={copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  onClick={handleCopyLink}
                >
                  {copied ? "Copied Link" : "Copy Link"}
                </Button>

                {onTrash && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<Trash className="h-3.5 w-3.5" />}
                    onClick={() => {
                      onTrash(file.id);
                      onClose();
                    }}
                  >
                    {file.isTrash ? "Restore" : "Move to Trash"}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onDownload && (
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<Download className="h-3.5 w-3.5" />}
                    onClick={() => onDownload(file)}
                  >
                    Download
                  </Button>
                )}
                <Button size="sm" variant="light" onClick={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
