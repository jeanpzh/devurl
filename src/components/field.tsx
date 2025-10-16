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
}

export default function Field({
  control,
  name,
  label,
  placeholder,
  className,
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
          className="font-medium text-sm flex items-center gap-1.5"
        >
          {label}
          {error && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
        </Label>
      )}
      <div className="relative min-h-[40px]">
        <Input
          {...field}
          id={name}
          placeholder={placeholder}
          className={cn(
            "w-full transition-colors px-4 py-2 bg-(--background) border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          )}
        />
        {error && (
          <p className="text-balance absolute -bottom-5 left-0 text-red-500 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
