"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOfflineLink } from "@/hooks/use-create-offline-link";
import {
  CreateOfflineLinkInput,
  createOfflineLinkSchema,
} from "@/schemas/create-offline-link.schema";
import { Button } from "../ui/button";
import Field from "../field";
import React from "react";
import { ShorterLinkResult } from "./shorter-link";
import { QRCodeDisplay } from "./qr-code";
import { Loader2, RefreshCwIcon } from "lucide-react";
import ShareButton from "./share-button";
import { env } from "@/lib/config";

export default function CreateOfflineLink() {
  const [shorterLink, setShorterLink] = React.useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<CreateOfflineLinkInput>({
    resolver: zodResolver(createOfflineLinkSchema),
  });
  const { mutateAsync: createLink, isPending, error } = useCreateOfflineLink();

  const onSubmit = async (data: CreateOfflineLinkInput) => {
    try {
      const { url } = await createLink(data);
      setShorterLink(url);
    } catch (error) {
      console.error("Error al crear link:", error);
    }
  };

  const handleReset = () => {
    setShorterLink(null);
    reset();
  };

  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <Field
          control={control}
          name="url"
          label="Link a acortar"
          placeholder={`https://domain.com/link`}
          className="flex flex-col gap-2 md:col-span-2"
        />
        <Field
          control={control}
          name="slug"
          label="Alias personalizado"
          placeholder="/mi-alias"
          className="flex flex-col gap-2 md:col-span-1"
        />
      </div>

      <Button
        size="lg"
        variant="outline"
        className="md:w-42 md:px-12 self-center"
        type="submit"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {isPending ? "Generando..." : "Genera el link"}
      </Button>

      {shorterLink && (
        <div className="w-full space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-1 duration-200">
          <ShorterLinkResult shorterLink={shorterLink} />
          <div className="flex flex-wrap items-center gap-2">
            <QRCodeDisplay shortUrl={shorterLink} />
            <ShareButton shortUrl={shorterLink} />
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 min-w-[100px]"
              type="button"
              onClick={handleReset}
            >
              <RefreshCwIcon className="size-4" /> Reset
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
