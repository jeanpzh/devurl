"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Sparkles } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "@/components/field";
import { useUpdateLink } from "@/app/dashboard/hooks/use-update-url";
import {
  createLinkSchema as updateLinkSchema,
  CreateLinkInput as UpdateLinkInput,
} from "@/schemas/link.schema";

export default function UpdateLinkButton({ url, slug, id }: UpdateLinkInput) {
  const { handleSubmit, control, reset, formState } = useForm<UpdateLinkInput>({
    resolver: zodResolver(updateLinkSchema),
    defaultValues: {
      slug: slug,
      url: url,
    },
  });

  const { mutateAsync: updateLink, isPending } = useUpdateLink();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: UpdateLinkInput) => {
    try {
      await updateLink({ slug: data.slug!, url: data.url!, id: id! });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    reset({
      slug: slug,
      url: url,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      handleReset();
    }, 200);
  };

  const hasChanges =
    formState.isDirty &&
    (formState.dirtyFields.slug || formState.dirtyFields.url);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        size={"icon"}
        className="rounded-full text-base md:text-lg h-9 w-9 md:h-10 md:w-10"
        title="Actualizar link"
      >
        <Pencil className="w-4 h-4 md:w-5 md:h-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl bg-(--background) border border-border shadow-(--shadow-l) p-4 md:p-10">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-lg md:text-2xl flex items-center gap-3 md:gap-4">
              {showSuccess ? (
                <>
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  ¡Link Actualizado!
                </>
              ) : (
                <>
                  <Pencil className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  Actualizar Link
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-base">
              {showSuccess
                ? "Los cambios se guardaron correctamente"
                : "Modifica el slug o la URL original del link"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {!showSuccess ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8 animate-in fade-in duration-300"
              >
                <div className="space-y-1 md:space-y-1.5">
                  <Label className="text-xs md:text-sm font-medium">Slug</Label>
                  <div className="flex items-center gap-1 md:gap-2 w-full">
                    <span className="text-xs md:text-sm text-muted-foreground font-mono whitespace-nowrap">
                      {process.env.NEXT_PUBLIC_DOMAIN_URL}/
                    </span>
                    <Field
                      control={control}
                      name="slug"
                      placeholder="mi-slug-personalizado"
                      className="font-mono w-full text-xs md:text-sm h-10 md:h-11"
                    />
                  </div>
                </div>
                <Field
                  control={control}
                  name="url"
                  label="URL Original"
                  placeholder={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/alias`}
                  className="text-xs md:text-sm font-medium"
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    variant="outline"
                    className="flex-1 text-xs md:text-base h-10 md:h-11"
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !hasChanges}
                    className="flex-1 bg-(--background-l) shadow-(--shadow-l) text-white text-xs md:text-base h-10 md:h-11"
                  >
                    {isPending ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-3 md:space-y-4 p-3 md:p-4 (--background-l) shadow-(--shadow-l) rounded-lg ">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-xs md:text-sm font-medium ">
                      Nuevo Slug
                    </Label>
                    <p className="text-xs md:text-sm font-mono text-foreground/80">
                      {process.env.NEXT_PUBLIC_DOMAIN_URL}/
                      {formState.dirtyFields.slug
                        ? control._formValues.slug
                        : slug}
                    </p>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-xs md:text-sm font-medium ">
                      URL Original
                    </Label>
                    <p className="text-xs md:text-sm font-mono text-foreground/80 break-all">
                      {formState.dirtyFields.url
                        ? control._formValues.url
                        : url}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleReset}
                    className="flex-1 text-xs md:text-base h-10 md:h-11"
                  >
                    Editar Otro
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 bg-transparent text-xs md:text-base h-10 md:h-11"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
