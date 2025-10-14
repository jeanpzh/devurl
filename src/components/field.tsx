import React from "react";
import { Control, useController } from "react-hook-form";
import { Input } from "./ui/input";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
  control: Control<any>;
  name: string;
  label: string;
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
    <div className={className}>
      <label
        htmlFor={name}
        className="font-medium text-sm flex items-center gap-1.5"
      >
        {label}
        {error && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
      </label>
      <div className="relative min-h-[40px]">
        <Input
          {...field}
          id={name}
          placeholder={placeholder}
          className={cn(
            "w-full transition-colors px-4 py-2",
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
