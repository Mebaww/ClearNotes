"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FolderShare } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, Check, RefreshCw, Eye, Folder } from "lucide-react";
import { sileo } from "sileo";

interface FolderShareModalProps {
  folderId: string;
  folderName: string;
  initialShare?: FolderShare | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShareStatusChange?: (updatedShare?: FolderShare | null) => void;
}

export default function FolderShareModal({
  folderId,
  folderName,
  initialShare = null,
  isOpen,
  onOpenChange,
  onShareStatusChange,
}: FolderShareModalProps) {
  const [share, setShare] = useState<FolderShare | null>(initialShare);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const [prevInitialShare, setPrevInitialShare] = useState(initialShare);
  if (initialShare !== prevInitialShare) {
    setPrevInitialShare(initialShare);
    setShare(initialShare);
  }

  useEffect(() => {
    let ignore = false;
    if (isOpen && folderId) {
      axios
        .get(`/api/folders/${folderId}/share`)
        .then((res) => {
          if (!ignore && res.data.success) {
            setShare(res.data.share);
          }
        })
        .catch((err) => console.error("Failed to fetch folder share status", err));
    }
    return () => {
      ignore = true;
    };
  }, [isOpen, folderId]);

  const shareUrl =
    typeof window !== "undefined" && share?.token
      ? `${window.location.origin}/share/folder/${share.token}`
      : "";

  const handleToggleShare = async (enabled: boolean) => {
    setLoading(true);
    try {
      if (enabled) {
        const res = await axios.post(`/api/folders/${folderId}/share`);
        if (res.data.success) {
          setShare(res.data.share);
          onShareStatusChange?.(res.data.share);
          sileo.success({ title: "Folder Link Enabled", description: "Anyone with the link can view this folder." });
        }
      } else {
        const res = await axios.delete(`/api/folders/${folderId}/share`);
        if (res.data.success) {
          setShare(res.data.share);
          onShareStatusChange?.(res.data.share);
          sileo.success({ title: "Folder Sharing Disabled", description: "The share link has been revoked." });
        }
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error", description: "Failed to update folder share settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    sileo.success({ title: "Link Copied", description: "Share link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await axios.patch(`/api/folders/${folderId}/share`);
      if (res.data.success) {
        setShare(res.data.share);
        onShareStatusChange?.(res.data.share);
        sileo.success({ title: "Link Regenerated", description: "Previous share links are now invalid." });
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error", description: "Failed to regenerate share link." });
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Folder className="size-4 text-primary" />
            Share &ldquo;{folderName}&rdquo;
          </DialogTitle>
          <DialogDescription className="text-xs">
            Anyone with this link will be able to view all notes inside this folder read-only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3.5">
            <div className="space-y-0.5">
              <label className="text-xs font-medium cursor-pointer">
                Public Share Link
              </label>
              <p className="text-[11px] text-muted-foreground">
                {share?.enabled ? "Link is currently active" : "Link is currently disabled"}
              </p>
            </div>
            <Switch
              checked={!!share?.enabled}
              onCheckedChange={handleToggleShare}
              disabled={loading}
            />
          </div>

          {/* Share Link Controls */}
          {share?.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="h-9 text-xs font-mono bg-muted/20"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-9 px-3 shrink-0 gap-1.5 text-xs cursor-pointer"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <div className="flex items-center gap-1">
                  <Eye className="size-3" />
                  <span>{share.viewCount} {share.viewCount === 1 ? "view" : "views"}</span>
                </div>

                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RefreshCw className={`size-3 ${regenerating ? "animate-spin" : ""}`} />
                  Regenerate Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
