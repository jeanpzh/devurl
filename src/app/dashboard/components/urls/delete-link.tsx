"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useDeleteLink } from "@/app/dashboard/hooks/use-delete-url";

interface DeleteLinkButtonProps {
  linkId: string;
  linkUrl: string;
}

export default function DeleteLinkButton({
  linkId,
  linkUrl,
}: DeleteLinkButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteLink, isPending } = useDeleteLink();

  const handleDelete = () => {
    deleteLink(
      { linkId },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        size={"icon"}
        aria-label="Eliminar Link"
        title="Eliminar Link"
        className="rounded-full"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-(--background) border border-border shadow-(--shadow-l) p-10">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-2xl flex items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El link será eliminado
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm font-medium text-red-600">
                Link a eliminar:
              </p>
              <p className="text-sm font-mono text-foreground/80 break-all">
                {linkUrl}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 bg-red-800 hover:bg-red-700 text-white"
              >
                {isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
