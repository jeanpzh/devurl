import React from "react";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";

export default function ShareButton({ shortUrl }: { shortUrl: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Link acortado",
          text: "Mira este link acortado",
          url: shortUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(shortUrl);
      alert("Link copiado al portapapeles");
    }
  };
  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="flex-1 gap-2
      bg-(--background-m) hover:bg-(--background-s)
      transition
      shadow-(--shadow-m) hover:shadow-(--shadow-s)
      rounded-full
      "
      type="button"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
