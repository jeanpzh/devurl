"use client";
import { ShorterLinkResult } from "@/components/links/shorter-link";
import React, { createContext, use } from "react";
import { EyeIcon, ExternalLinkIcon, CalendarIcon } from "lucide-react";
import DeleteLink from "./delete-link";
import UpdateLink from "./update-link";
import { QRCodeDisplay } from "@/components/links/qr-code";

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
      <div className="flex flex-col gap-4 w-full p-4 rounded-xl border border-border h-50 shadow-(--shadow-l) bg-(--background) hover:shadow-(--shadow-s) transition-all hover:bg-(--background-light)">
        {children}
      </div>
    </URLItemProvider>
  );
};
URLItem.displayName = "URLItem";

const URLItemShort = () => {
  const { slug } = useURLItemContext();
  return <ShorterLinkResult shorterLink={slug} />;
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

const URLItemDeleteButton = () => {
  const { original_url, slug } = useURLItemContext();
  return (
    <div
      className="flex items-center justify-end rounded-full bg-(--background-light) hover:bg-(--background) 
    hover:scale-105
    active:scale-90 transition-all shadow-(--shadow-s)"
    >
      <DeleteLink linkId={slug} linkUrl={original_url} />
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
      <QRCodeDisplay shortUrl={slug} />
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
          <span className="font-mono">
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
    <div className="flex items-center justify-between border-b border-border gap-2">
      <div className="flex-1 min-w-0">
        <URLItemShort />
      </div>
      <div className="flex items-center gap-1.5">
        <URLItemQRButton />
        <URLItemUpdateButton />
        <URLItemDeleteButton />
      </div>
    </div>
    <div className="p-2 gap-4 flex flex-col">
      <URLItemOriginal />
      <div className="flex justify-between items-center">
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
  URLItemDeleteButton,
};
