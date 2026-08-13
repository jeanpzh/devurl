"use client";
import { ShorterLinkResult } from "@/components/links/shorter-link";
import React, { createContext, use } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  ExternalLinkIcon,
} from "lucide-react";
import DeleteLink from "./delete-link";
import UpdateLink from "./update-link";
import { QRCodeDisplay } from "@/components/links/qr-code";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSetLinkStatus } from "@/app/dashboard/hooks/use-set-link-status";

const URLItemContext = createContext<ShortLink | null>(null);

const URLItemProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ShortLink;
}) => {
  return <URLItemContext value={value}>{children}</URLItemContext>;
};

const useURLItemContext = () => {
  const context = use(URLItemContext);
  if (!context) {
    throw new Error("URLItemContext must be used within a URLItemProvider");
  }
  return context;
};

const URLItem = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: ShortLink;
}) => {
  return (
    <URLItemProvider value={data}>
      <div className="flex min-h-52 flex-col gap-4 border border-terminal-border bg-terminal-surface/40 p-4 transition-colors hover:border-terminal-accent/70 hover:bg-terminal-hover">
        {children}
      </div>
    </URLItemProvider>
  );
};
URLItem.displayName = "URLItem";

const URLItemShort = () => {
  const { slug } = useURLItemContext();
  return (
    <ShorterLinkResult
      shorterLink={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/${slug}`}
    />
  );
};
URLItemShort.displayName = "URLItemShort";

const URLItemClicksCount = () => {
  const { clicks_count } = useURLItemContext();
  return (
    <div className="text-sm font-medium flex items-center gap-2">
      <EyeIcon className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground font-mono font-bold">
        {clicks_count}
      </span>
    </div>
  );
};
URLItemClicksCount.displayName = "URLItemClicksCount";

const URLItemStatusButton = () => {
  const { id, is_active } = useURLItemContext();
  const { mutate, isPending } = useSetLinkStatus();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="h-10 min-w-32 justify-between rounded-none border-terminal-border-strong bg-terminal-surface px-3 text-[10px] uppercase tracking-[0.08em] text-terminal-text hover:border-terminal-accent hover:bg-terminal-hover hover:text-terminal-text"
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${is_active ? "bg-terminal-status" : "bg-terminal-muted"}`}
            />
            {is_active ? "En línea" : "Inactivo"}
          </span>
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-32 rounded-none border-terminal-border bg-terminal-surface text-terminal-text"
      >
        <DropdownMenuRadioGroup
          value={is_active ? "active" : "inactive"}
          onValueChange={(value) => {
            const nextIsActive = value === "active";
            if (nextIsActive !== is_active) {
              mutate({ linkId: id, isActive: nextIsActive });
            }
          }}
        >
          <DropdownMenuRadioItem
            value="active"
            className="rounded-none text-[10px] uppercase tracking-[0.08em] focus:bg-terminal-hover focus:text-terminal-text"
          >
            En línea
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="inactive"
            className="rounded-none text-[10px] uppercase tracking-[0.08em] focus:bg-terminal-hover focus:text-terminal-text"
          >
            Inactivo
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
URLItemStatusButton.displayName = "URLItemStatusButton";

const URLItemDeleteButton = () => {
  const { original_url, id } = useURLItemContext();
  return (
    <div
      className="flex items-center justify-end rounded-full bg-(--background-light) hover:bg-(--background) 
    hover:scale-105
    active:scale-90 transition-all shadow-(--shadow-s)"
    >
      <DeleteLink linkId={id} linkUrl={original_url} />
    </div>
  );
};

const URLItemQRButton = () => {
  const { slug } = useURLItemContext();
  return (
    <div
      className="flex items-center justify-end bg-(--background-light) hover:bg-(--background) 
    hover:scale-105
    active:scale-90 rounded-full transition-all
    shadow-(--shadow-s)
    "
    >
      <QRCodeDisplay
        shortUrl={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/${slug}`}
      />
    </div>
  );
};

URLItemDeleteButton.displayName = "URLItemDeleteButton";
const URLItemOriginal = () => {
  const { original_url } = useURLItemContext();
  return (
    <div className="flex items-center justify-between bg-() ">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <ExternalLinkIcon className="size-4 text-muted-foreground" />
          <span className="break-all font-mono text-xs sm:text-sm">
            {original_url.length > 30
              ? `${original_url.slice(0, 30)}...`
              : original_url}
          </span>
        </div>
      </div>
    </div>
  );
};
URLItemOriginal.displayName = "URLItemOriginal";

const URLItemUpdateButton = () => {
  const { original_url, slug, id } = useURLItemContext();
  return (
    <div
      className="flex items-center justify-end bg-(--background-light) hover:bg-(--background) 
    hover:scale-105
    active:scale-90 rounded-full transition-all
    shadow-(--shadow-s)
    "
    >
      <UpdateLink slug={slug} url={original_url} id={id} />
    </div>
  );
};

const URLItemCreatedAt = () => {
  const { created_at } = useURLItemContext();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground font-mono">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
URLItemCreatedAt.displayName = "URLItemCreatedAt";

const URLItemComponent = ({ url }: { url: ShortLink }) => (
  <URLItem key={url.id} data={url}>
    <div className="flex flex-col gap-3 border-b border-terminal-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <URLItemShort />
      </div>
      <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
        <URLItemStatusButton />
        <URLItemQRButton />
        <URLItemUpdateButton />
        <URLItemDeleteButton />
      </div>
    </div>
    <div className="flex flex-col gap-4 px-1 pt-1">
      <URLItemOriginal />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <URLItemCreatedAt />
        <URLItemClicksCount />
      </div>
    </div>
  </URLItem>
);

URLItemComponent.displayName = "URLItemComponent";

export {
  URLItemComponent,
  URLItemShort,
  URLItemOriginal,
  URLItemCreatedAt,
  URLItemUpdateButton,
  URLItemClicksCount,
  URLItemStatusButton,
  URLItemDeleteButton,
};
