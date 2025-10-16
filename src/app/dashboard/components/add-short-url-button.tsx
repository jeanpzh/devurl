"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon, Link2, Sparkles } from "lucide-react";
import { ShorterLinkResult } from "@/components/links/shorter-link";
import { QRCodeDisplay } from "@/components/links/qr-code";
import { useCreateLink } from "@/hooks/use-create-link";
import { useForm } from "react-hook-form";
import { CreateLinkInput, createLinkSchema } from "@/schemas/link.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "@/components/field";
import { clientEnv } from "@/lib/config";

interface CreationResult {
  shorterLink: string;
  originalLink: string;
  slug?: string;
}

export default function AddShortUrlButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleSubmit, control, reset } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      url: "",
      slug: "",
    },
  });
  const {
    mutateAsync: createShortUrl,
    isPending: isLoading,
    error,
  } = useCreateLink();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<CreationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const onSubmit = async (data: CreateLinkInput) => {
    try {
      const response = await createShortUrl(data);

      setResult({
        shorterLink: response.url,
        originalLink: data.url,
        slug: data.slug || undefined,
      });

      setShowResult(true);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    handleReset();
  };

  const handleReset = () => {
    setShowResult(false);
    reset();
    setResult(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      handleReset();
    }, 200);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="cursor-pointer hover:scale-105 active:scale-95 duration-300 ease-in-out gap-2 bg-(--background) hover:bg-(--background-light) text-foreground border border-border shadow-(--shadow-s) h-11 px-4 flex items-center"
      >
        <PlusIcon />
        {children}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl bg-(--background) border border-border shadow-(--shadow-l) p-10">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-2xl flex items-center gap-4">
              {showResult ? (
                <>
                  <Sparkles className="h-6 w-6 text-accent" />
                  ¡Link Creado Exitosamente!
                </>
              ) : (
                <>
                  <Link2 className="h-6 w-6 text-accent" />
                  Crear Link Acortado
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {showResult
                ? "Tu link acortado está listo para usar. Cópialo o genera un código QR."
                : "Ingresa tu URL larga y opcionalmente personaliza el slug"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {!showResult ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 animate-in fade-in duration-300 "
              >
                <Field
                  control={control}
                  name="url"
                  label="Link a acortar"
                  placeholder={`${clientEnv.NEXT_PUBLIC_DOMAIN_URL}/tu-alias`}
                />

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Personalizar Slug
                  </Label>
                  <div className="flex items-center gap-2 w-full ">
                    <span className="text-sm text-muted-foreground font-mono whitespace-nowrap ">
                      {clientEnv.NEXT_PUBLIC_DOMAIN_URL}/
                    </span>
                    <Field
                      control={control}
                      name="slug"
                      placeholder="my-custom-slug"
                      className="font-mono w-full text-sm h-11"
                    />
                  </div>
                  <p className="text-sm font-mono text-muted-foreground mt-8">
                    Deja vacío para que se genere automáticamente
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#1c482b] hover:bg-[#1c482b]/90 h-11 text-white"
                  >
                    {isLoading ? "Creando..." : "Crear link acortado"}
                  </Button>
                </div>
              </form>
            ) : (
              result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Link Acortado</Label>
                    <ShorterLinkResult shorterLink={result.shorterLink} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Código QR</Label>
                    <QRCodeDisplay shortUrl={result.shorterLink} />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <Label className="text-sm font-medium text-muted-foreground">
                      URL Original
                    </Label>
                    <p className="text-sm font-mono text-foreground/80 break-all bg-muted p-3 rounded-md">
                      {result.originalLink}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleReset} className="flex-1">
                      Crear Otro Link
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
