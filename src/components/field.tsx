import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Input } from "./ui/input";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface FieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  className?: string;
  prefix?: string;
  suffix?: React.ReactNode;
  labelClassName?: string;
  disabled?: boolean;
  helperText?: string;
}

export default function Field<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helperText,
  className,
  prefix,
  suffix,
  labelClassName,
  disabled,
}: FieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const hasError = Boolean(error);
  const messageId = `${name}-message`;

  const inputClassName = cn(
    "h-[46px] w-full rounded-[1px]",
    "border border-terminal-border",
    "bg-terminal-input px-3.5 py-2",
    "text-sm text-terminal-text",
    "shadow-none outline-none",
    "placeholder:text-terminal-subtle",
    "transition-colors duration-100",
    "focus:border-terminal-accent-strong",
    "focus:ring-1 focus:ring-terminal-accent-strong",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasError &&
      "border-terminal-error focus:border-terminal-error focus:ring-terminal-error focus-visible:border-terminal-error focus-visible:ring-terminal-error",
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "flex items-center gap-1.5",
            "text-sm font-medium",
            labelClassName,
          )}
        >
          <span>{label}</span>

          {hasError && (
            <AlertCircle
              className="h-3.5 w-3.5 shrink-0 text-terminal-error"
              aria-hidden="true"
            />
          )}
        </Label>
      )}

      <div>
        {suffix ? (
          /*
           * Variante con contenido lateral.
           * Ejemplo: input del alias + vista previa de la URL.
           */
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              {...field}
              id={name}
              value={field.value ?? ""}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={messageId}
              className={inputClassName}
            />

            {suffix}
          </div>
        ) : prefix ? (
          /*
           * Variante con prefijo dentro del campo.
           * Ejemplo: devrl.app/ + alias.
           *
           * El borde se aplica al contenedor porque el Input
           * interno no tiene borde.
           */
          <div
            className={cn(
              "flex min-h-[46px] items-center overflow-hidden",
              "rounded-[1px] border",
              "bg-terminal-input px-3.5",
              "text-sm text-terminal-accent-strong",
              "transition-colors duration-100",
              "focus-within:border-terminal-accent-strong",
              "focus-within:ring-1 focus-within:ring-terminal-accent-strong",
              disabled && "cursor-not-allowed opacity-50",
              hasError
                ? [
                    "border-terminal-error",
                    "focus-within:border-terminal-error",
                    "focus-within:ring-terminal-error",
                    "shadow-[inset_3px_0_0_rgba(212,106,106,0.9)]",
                  ]
                : "border-terminal-border",
            )}
          >
            <span className="shrink-0" aria-hidden="true">
              {prefix}
            </span>

            <Input
              {...field}
              id={name}
              value={field.value ?? ""}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={messageId}
              className={cn(
                "min-w-0 flex-1",
                "border-0 bg-transparent pl-2",
                "text-terminal-text shadow-none",
                "placeholder:text-terminal-subtle",
                "focus-visible:border-0",
                "focus-visible:ring-0",
                "focus-visible:ring-offset-0",
                "disabled:cursor-not-allowed",
              )}
            />
          </div>
        ) : (
          /*
           * Variante normal.
           */
          <Input
            {...field}
            id={name}
            value={field.value ?? ""}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={messageId}
            className={inputClassName}
          />
        )}

        {/*
         * Se reserva espacio para evitar saltos en el layout.
         * El error sustituye al texto de ayuda.
         */}
        <div
          id={messageId}
          className="mt-1.5 min-h-5 text-xs leading-5"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasError ? (
            <p
              role="alert"
              className="flex items-start gap-1.5 text-terminal-error"
            >
              <AlertCircle
                className="mt-[3px] h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />

              <span>
                <span className="font-medium">ERR:</span> {error?.message}
              </span>
            </p>
          ) : helperText ? (
            <p className="text-terminal-subtle">{helperText}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
