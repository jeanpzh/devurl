import React from "react";
import { Control, useController } from "react-hook-form";
import { Input } from "./ui/input";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface FieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  prefix?: string;
  suffix?: React.ReactNode;
  labelClassName?: string;
}

export default function Field({
  control,
  name,
  label,
  placeholder,
  className,
  prefix,
  suffix,
  labelClassName,
}: FieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn("font-medium text-sm flex items-center gap-1.5", labelClassName)}
        >
          {label}
          {error && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
        </Label>
      )}
      <div className="relative min-h-[40px]">
        {suffix ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              {...field}
              id={name}
              placeholder={placeholder}
              className={cn(
                "h-[46px] w-full rounded-[1px] border border-terminal-border bg-terminal-input px-3.5 py-2 text-sm text-terminal-text shadow-none transition-colors placeholder:text-terminal-subtle focus:border-terminal-accent-strong focus:ring-1 focus:ring-terminal-accent-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-terminal-error focus-visible:ring-terminal-error" : ""
              )}
            />
            {suffix}
          </div>
        ) : prefix ? (
          <div className="flex min-h-[46px] items-center overflow-hidden rounded-[1px] border border-terminal-border bg-terminal-input px-3.5 text-sm text-terminal-accent-strong">
            <span className="shrink-0" aria-hidden="true">{prefix}</span>
            <Input
              {...field}
              id={name}
              placeholder={placeholder}
              className={cn(
                "min-w-0 border-0 bg-transparent pl-2 text-terminal-text shadow-none focus-visible:border-0 focus-visible:ring-0 placeholder:text-terminal-subtle disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-terminal-error focus-visible:ring-terminal-error" : ""
              )}
            />
          </div>
        ) : (
          <Input
            {...field}
            id={name}
            placeholder={placeholder}
            className={cn(
               "h-[46px] w-full rounded-[1px] border border-terminal-border bg-terminal-input px-3.5 py-2 text-sm text-terminal-text shadow-none transition-colors placeholder:text-terminal-subtle focus:border-terminal-accent-strong focus:ring-1 focus:ring-terminal-accent-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
               error ? "border-terminal-error focus-visible:ring-terminal-error" : ""
            )}
          />
        )}
        {error && (
           <p className="text-balance absolute -bottom-5 left-0 text-terminal-error text-xs animate-in fade-in slide-in-from-top-1 duration-200">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
