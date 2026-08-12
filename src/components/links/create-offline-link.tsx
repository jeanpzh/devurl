"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLink } from "@/hooks/use-create-link";
import { CreateLinkInput, createLinkSchema } from "@/schemas/link.schema";
import { Button } from "../ui/button";
import Field from "../field";
import React from "react";
import { ShorterLinkResult } from "./shorter-link";
import { QRCodeDisplay } from "./qr-code";
import { Loader2, RefreshCwIcon } from "lucide-react";
import ShareButton from "./share-button";

export default function CreateOfflineLink() {
  const [shorterLink, setShorterLink] = React.useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
  });
  const slug = useWatch({ control, name: "slug", defaultValue: "" });
  const { mutateAsync: createLink, isPending } = useCreateLink();

  const onSubmit = async (data: CreateLinkInput) => {
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
      className="overflow-hidden rounded-[2px] border border-terminal-border bg-terminal-surface-strong/95 shadow-terminal-panel"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex min-h-[48px] items-center justify-between border-b border-terminal-border px-4 text-xs uppercase tracking-[0.1em] text-terminal-accent md:px-6">
        <span>Create short link</span>
        <span className="text-lg tracking-[0.2em] text-terminal-accent-strong" aria-hidden="true">_ □</span>
      </div>

      <div className="flex flex-col gap-4 p-4 md:gap-5 md:p-6">
        <div className="flex flex-col">
          <Field
            control={control}
            name="url"
            label="Target URL"
            placeholder="https://domain.com/very/long/url/that/you/want/to/shorten"
             labelClassName="text-xs uppercase tracking-[0.08em] text-terminal-accent-strong"
          />
        </div>
        <div className="flex flex-col">
          <Field
            control={control}
            name="slug"
            label="Custom alias (optional)"
            placeholder="mi-alias"
             labelClassName="text-xs uppercase tracking-[0.08em] text-terminal-accent-strong"
            className="gap-2"
            suffix={
               <div className="flex min-h-[46px] items-center border border-terminal-border bg-terminal-input px-3.5 text-sm text-terminal-accent-strong">
                <span>devrl.app&nbsp; / &nbsp;</span>
                 <span className="text-terminal-subtle">{slug || "mi-alias"}</span>
              </div>
            }
          />
        </div>

        <Button
          size="lg"
          variant="outline"
          className="mt-0.5 min-h-11 self-center rounded-[1px] border border-terminal-accent-strong bg-transparent px-6 font-['IBM_Plex_Mono'] text-[13px] font-semibold tracking-[0.08em] text-terminal-accent-strong transition-colors hover:bg-terminal-accent-strong hover:text-terminal-on-accent active:translate-y-px"
          type="submit"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isPending ? "GENERANDO..." : "[ GENERAR LINK ]"}
        </Button>
      </div>

        <div className="mt-3 rounded-[2px] border border-terminal-border bg-terminal-surface/80">
            <div className="flex min-h-12 items-center justify-between border-b border-terminal-border px-4 text-xs uppercase tracking-[0.1em] text-terminal-text md:px-6">
            <span>Output</span>
             {/*  <div className="flex gap-3 text-[9px] tracking-[0.04em] text-terminal-muted md:gap-8 md:text-[11px]">
                 <span className="hidden text-terminal-accent-strong sm:inline">Server: devrl-01</span>
                 <span className="hidden text-terminal-accent-strong sm:inline">Latency: 24ms</span>
               <span className="size-[7px] self-center rounded-full bg-terminal-status shadow-[0_0_9px_var(--terminal-status)]" aria-label="Ready" />
            </div> */}
          </div>
          <div className="p-4 md:p-6">
             <p className="mb-3 text-[13px] text-terminal-accent-strong">
              &gt; {shorterLink ? "READY. LINK CREATED_" : "READY. AWAITING INPUT_"}
            </p>
              <div className="flex min-h-12 items-stretch border border-terminal-border bg-terminal-input">
              {shorterLink ? (
                <>
                  <ShorterLinkResult shorterLink={shorterLink} />
                  <div className="flex flex-wrap items-center gap-2 p-2">
                    <QRCodeDisplay shortUrl={shorterLink} />
                    <ShareButton shortUrl={shorterLink} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-[100px] flex-1 gap-2"
                      type="button"
                      onClick={handleReset}
                    >
                      <RefreshCwIcon className="size-4" /> Reset
                    </Button>
                  </div>
                </>
              ) : (
                <>
                    <div className="flex min-w-0 flex-1 items-center px-3 text-sm text-terminal-subtle">
                    https://devrl.app/mi-alias
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                      className="min-w-[104px] rounded-none border-l border-terminal-border text-xs tracking-[0.08em] text-terminal-accent-strong hover:bg-terminal-hover hover:text-terminal-text"
                    type="button"
                    disabled
                  >
                    [ COPY ]
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
    </form>
  );
}
