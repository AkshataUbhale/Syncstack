"use client";

import { useState } from "react";
import { Folder, Star, Download, Trash, Eye, Copy, Check, ExternalLink } from "lucide-react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";
import { formatDistanceToNow } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "@/components/FileIcon";

interface FileGridViewProps {
  files: FileType[];
  onItemClick: (file: FileType) => void;
  onStar: (fileId: string) => void;
  onTrash: (fileId: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileGridView({
  files,
  onItemClick,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileGridViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (e: React.MouseEvent, file: FileType) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(file.fileUrl);
      setCopiedId(file.id);
      addToast({
        title: "Link Copied",
        description: `Copied URL for "${file.name}"`,
        color: "success",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast({
        title: "Copy Failed",
        description: "Could not copy link",
        color: "danger",
      });
    }
  };

  const formattedSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => {
        const isImage = file.type.startsWith("image/");
        const thumbnailUrl = isImage
          ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}/tr:w-400,h-300,fo-auto,q-80/${file.path}`
          : null;

        if (file.isFolder) {
          return (
            <Card
              key={file.id}
              isPressable
              onClick={() => onItemClick(file)}
              className="border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-primary/40 transition-all duration-200 group"
            >
              <CardBody className="p-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                  <Folder className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-primary transition-colors">
                    {file.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Folder</p>
                </div>
              </CardBody>
            </Card>
          );
        }

        return (
          <Card
            key={file.id}
            isPressable
            onClick={() => onItemClick(file)}
            className="border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col"
          >
            {/* Image / Thumbnail Preview Area */}
            <div className="relative aspect-[4/3] w-full bg-zinc-950/70 overflow-hidden flex items-center justify-center">
              {isImage && thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="p-6">
                  <FileIcon file={file} />
                </div>
              )}

              {/* Star Badge Top Left */}
              {file.isStarred && (
                <div className="absolute top-2.5 left-2.5 z-10 p-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-yellow-400 border border-yellow-400/20">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                </div>
              )}

              {/* Quick Actions Hover Overlay */}
              <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-2">
                <Tooltip content="Preview">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-zinc-800/90 text-zinc-200 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(file);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Tooltip content={copiedId === file.id ? "Copied!" : "Copy Link"}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-zinc-800/90 text-zinc-200 hover:text-white"
                    onClick={(e) => handleCopyLink(e, file)}
                  >
                    {copiedId === file.id ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </Tooltip>

                <Tooltip content="Download">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-zinc-800/90 text-zinc-200 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(file);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Tooltip content={file.isStarred ? "Unstar" : "Star"}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className={
                      file.isStarred
                        ? "bg-yellow-400/20 text-yellow-400"
                        : "bg-zinc-800/90 text-zinc-200 hover:text-white"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onStar(file.id);
                    }}
                  >
                    <Star className="h-4 w-4" fill={file.isStarred ? "currentColor" : "none"} />
                  </Button>
                </Tooltip>

                <Tooltip content={file.isTrash ? "Delete Permanently" : "Move to Trash"}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    className="bg-danger/20 text-danger hover:bg-danger hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file.isTrash) {
                        onDelete(file);
                      } else {
                        onTrash(file.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Card Footer Info */}
            <CardFooter className="p-3 bg-zinc-900/90 flex flex-col items-start gap-1 text-left border-t border-zinc-800/60">
              <p className="font-medium text-xs text-zinc-200 truncate w-full" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center justify-between w-full text-[11px] text-zinc-400">
                <span>{formattedSize(file.size)}</span>
                <span>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
