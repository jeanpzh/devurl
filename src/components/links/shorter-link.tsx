"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortenedLinkResultProps {
  shorterLink: string;
  className?: string;
}

export function ShorterLinkResult({
  shorterLink,
  className,
}: ShortenedLinkResultProps) {
  const [copied, setCopied] = useState(false);

  const parseUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const host = urlObj.host;
      const slug = urlObj.pathname.slice(1);
      return { host, slug, fullUrl: url };
    } catch {
      return { host: "", slug: url, fullUrl: url };
    }
  };

  const { host, slug, fullUrl } = parseUrl(shorterLink);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNavigate = () => {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md cursor-pointer",
        className
      )}
      onClick={handleNavigate}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex items-center gap-1 font-mono text-sm min-w-0 overflow-hidden">
          <span className="text-primary font-semibold">{host}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium truncate">{slug}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="flex-shrink-0 h-8 w-8 p-0"
        onClick={handleCopy}
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
