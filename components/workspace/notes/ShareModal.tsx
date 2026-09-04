"use client";

import { useState } from "react";

import axios from "axios";
import { Copy, Check, Share2, RefreshCw, Eye, ShieldAlert } from "lucide-react";
import { NoteShare } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { sileo } from "sileo";

interface ShareModalProps {
  noteId: string;
  initialShare?: NoteShare | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShareStatusChange?: (updatedShare?: NoteShare | null) => void;
}


export function ShareModal({
  noteId,
  initialShare,
  isOpen,
  onOpenChange,
  onShareStatusChange,
}: ShareModalProps) {
  const [share, setShare] = useState<NoteShare | null>(initialShare || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [prevInitialShare, setPrevInitialShare] = useState(initialShare);
  if (initialShare !== prevInitialShare) {
    setPrevInitialShare(initialShare);
    setShare(initialShare || null);
  }

  const isEnabled = Boolean(share?.enabled);

  const shareUrl =
    typeof window !== "undefined" && share?.token
      ? `${window.location.origin}/share/${share.token}`
      : "";

  const handleToggleShare = async (checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        const res = await axios.post(`/api/notes/${noteId}/share`);
        if (res.data.success) {
          setShare(res.data.share);
          onShareStatusChange?.(res.data.share);
          sileo.success({ title: "Share link enabled!" });
        }
      } else {
        const res = await axios.delete(`/api/notes/${noteId}/share`);
        if (res.data.success) {
          setShare(res.data.share);
          onShareStatusChange?.(res.data.share);
          sileo.success({ title: "Share link disabled." });
        }
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to update share settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (
      !confirm(
        "Are you sure you want to regenerate the share token? The current share link will immediately stop working."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/notes/${noteId}/share`, {
        action: "regenerate",
      });
      if (res.data.success) {
        setShare(res.data.share);
        onShareStatusChange?.(res.data.share);
        sileo.success({ title: "New share link generated!" });
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to regenerate share link." });
    } finally {
      setLoading(false);
    }
  };


  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    sileo.success({ title: "Link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Share2 className="size-5 text-primary" />
            Share Note
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Anyone with this link will be able to view a read-only version of this note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/30">
            <div className="space-y-0.5">
              <label className="text-sm font-medium leading-none">
                Public Share Link
              </label>
              <p className="text-xs text-muted-foreground">
                {isEnabled ? "Link is active" : "Link is currently disabled"}
              </p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleShare}
              disabled={loading}
            />
          </div>

          {isEnabled && (
            <div className="space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none"
                />
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 h-9 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-green-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {share?.viewCount || 0} views
                </span>

                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="size-3" />
                  <span>Regenerate link</span>
                </button>
              </div>
            </div>
          )}

          {!isEnabled && (
            <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
              <ShieldAlert className="size-4 shrink-0 mt-0.5" />
              <span>
                Sharing is disabled. Any existing shared links for this note will return a 404 error.
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
