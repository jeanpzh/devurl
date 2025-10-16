"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, QrCode } from "lucide-react";

interface QRCodeDisplayProps {
  shortUrl: string;
  className?: string;
  size?: number;
}

export function QRCodeDisplay({
  shortUrl,
  className,
  size = 200,
}: QRCodeDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsSVG = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-code-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsPNG = (customSize?: number) => {
    setIsDownloading(true);
    try {
      const svg = document.getElementById("qr-code-svg");
      if (!svg) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const finalSize = customSize || size;
      const padding = 40;
      canvas.width = finalSize + padding * 2;
      canvas.height = finalSize + padding * 2;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, padding, padding, finalSize, finalSize);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `qr-code-${
            customSize ? `${customSize}px` : "standard"
          }-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          setIsDownloading(false);
        });
      };

      img.src = url;
    } catch (err) {
      console.error("Failed to download QR code:", err);
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="flex-1 gap-2 rounded-full"
            type="button"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG
                id="qr-code-svg"
                value={shortUrl}
                size={size}
                level="H"
                marginSize={0}
              />
            </div>

            <div className="flex justify-center gap-3 w-full ">
              <Button
                onClick={downloadAsSVG}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white justify-start"
                size="lg"
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                SVG
              </Button>
              <Button
                onClick={() => downloadAsPNG()}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white justify-start"
                size="lg"
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                PNG
              </Button>
              <Button
                onClick={() => downloadAsPNG(1200)}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white justify-start"
                size="lg"
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                PNG 1200
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
