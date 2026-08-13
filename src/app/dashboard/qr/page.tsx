"use client";

import { useState } from "react";
import { Copy, Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardEmptyState from "../components/dashboard-empty-state";
import DashboardPageHeader from "../components/dashboard-page-header";
import { useDashboardLinks } from "../hooks/use-dashboard-links";

export default function QRPage() {
  const { data, isLoading } = useDashboardLinks();
  const links = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const visibleLinks = links.filter((link) =>
    `${link.slug} ${link.original_url}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selected = links.find((link) => link.id === selectedId);
  const shortUrl = selected
    ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${selected.slug}`
    : "";
  const [format, setFormat] = useState<"svg" | "png">("png");
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(4);

  const copyLink = async () => {
    if (shortUrl) await navigator.clipboard.writeText(shortUrl);
  };

  const downloadQr = () => {
    const svg = document.querySelector("[data-dashboard-qr]");
    if (!svg || !selected) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === "svg") {
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      triggerDownload(URL.createObjectURL(blob), `devrl-${selected.slug}.svg`);
      return;
    }
    const image = new Image();
    const url = URL.createObjectURL(
      new Blob([svgData], { type: "image/svg+xml" }),
    );
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d")?.drawImage(image, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob)
          triggerDownload(
            URL.createObjectURL(blob),
            `devrl-${selected.slug}.png`,
          );
        URL.revokeObjectURL(url);
      });
    };
    image.src = url;
  };

  const triggerDownload = (url: string, filename: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        index="03"
        title="Estación QR"
        description="Genera códigos para tus enlaces acortados."
      />
      {isLoading ? (
        <div className="h-96 animate-pulse border border-terminal-border bg-terminal-surface" />
      ) : links.length === 0 ? (
        <DashboardEmptyState
          icon={QrCode}
          title="Sin links disponibles"
          description="Crea tu primer link para generar su código QR."
          action={{ label: "Crear link", href: "/dashboard#create-link" }}
        />
      ) : (
        <div className="grid gap-0 border border-terminal-border lg:grid-cols-[1.2fr_0.8fr]">
          <section className="border-b border-terminal-border p-5 lg:border-b-0 lg:border-r">
            <div className="relative">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar link..."
                aria-label="Buscar link para QR"
                className="h-11 rounded-none border-terminal-border bg-terminal-input pl-4 text-xs"
              />
            </div>
            <h2 className="mb-3 mt-7 text-xs uppercase tracking-[0.08em]">
              Seleccionar link
            </h2>
            <div className="divide-y divide-terminal-border border-y border-terminal-border">
              {visibleLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setSelectedId(link.id)}
                  className={`grid w-full grid-cols-[1.2fr_1fr_auto] gap-3 px-3 py-4 text-left text-xs transition-colors hover:bg-terminal-hover ${selected?.id === link.id ? "border-l-2 border-terminal-accent bg-terminal-hover" : ""}`}
                >
                  <span className="min-w-0">
                    <strong className="block truncate text-terminal-text">
                      {link.slug}
                    </strong>
                    <span className="mt-1 block truncate text-terminal-muted">
                      {shortUrl.replace(
                        `/${selected?.slug ?? ""}`,
                        `/${link.slug}`,
                      )}
                    </span>
                  </span>
                  <span className="truncate text-terminal-muted">
                    {link.original_url}
                  </span>
                  <span className="text-terminal-status">LISTO</span>
                </button>
              ))}
            </div>
          </section>
          <section className="flex min-h-[500px] flex-col p-5">
            <div className="flex items-center justify-between border-b border-terminal-border pb-5">
              <div>
                <p className="text-sm font-semibold uppercase">
                  QR // {selected?.slug ?? ""}
                </p>
                <p className="mt-3 break-all text-xs text-terminal-accent">
                  {shortUrl}
                </p>
              </div>
              <QrCode className="size-5 text-terminal-accent" />
            </div>
            {selected ? (
              <>
                <div className="mx-auto mt-7 border border-terminal-border bg-white p-4">
                  <QRCodeSVG
                    data-dashboard-qr
                    value={shortUrl}
                    size={260}
                    level="H"
                    marginSize={margin}
                  />
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <label className="text-[10px] uppercase text-terminal-muted">
                    Formato
                    <select
                      value={format}
                      onChange={(event) =>
                        setFormat(event.target.value as "svg" | "png")
                      }
                      className="mt-2 h-10 w-full border border-terminal-border bg-terminal-input px-2 text-xs text-terminal-text"
                    >
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                    </select>
                  </label>
                  <label className="text-[10px] uppercase text-terminal-muted">
                    Tamaño
                    <select
                      value={size}
                      onChange={(event) => setSize(Number(event.target.value))}
                      className="mt-2 h-10 w-full border border-terminal-border bg-terminal-input px-2 text-xs text-terminal-text"
                    >
                      <option value="256">256 PX</option>
                      <option value="512">512 PX</option>
                      <option value="1024">1024 PX</option>
                    </select>
                  </label>
                  <label className="text-[10px] uppercase text-terminal-muted">
                    Margen
                    <select
                      value={margin}
                      onChange={(event) =>
                        setMargin(Number(event.target.value))
                      }
                      className="mt-2 h-10 w-full border border-terminal-border bg-terminal-input px-2 text-xs text-terminal-text"
                    >
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="8">8</option>
                    </select>
                  </label>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => void copyLink()}
                    className="h-11 rounded-none border-terminal-accent text-xs uppercase text-terminal-accent"
                  >
                    <Copy className="size-4" /> Copiar link
                  </Button>
                  <Button
                    onClick={downloadQr}
                    className="h-11 rounded-none bg-terminal-accent text-xs uppercase text-terminal-on-accent hover:bg-terminal-accent-strong"
                  >
                    <Download className="size-4" /> Descargar QR
                  </Button>
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.08em] text-terminal-status">{`● QR ready // ${size}×${size} // ${format.toUpperCase()}`}</p>
              </>
            ) : (
              <p className="m-auto text-xs text-terminal-muted">
                Selecciona un link para previsualizar su QR.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
