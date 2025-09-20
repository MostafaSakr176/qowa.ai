'use client'
import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface TextareaProps extends ComponentProps<"textarea"> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label?: ReactNode;
  labelClassName?: string;
  error?: FieldError;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, icon, iconPosition = "left", label, labelClassName, id, error, rows = 4, ...props },
    ref
  ) => {
    const hasLeftIcon = !!icon && iconPosition === "left";
    const hasRightIcon = !!icon && iconPosition === "right";
    const textareaId = id || (label ? `textarea-${Math.random().toString(36).slice(2, 11)}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn("block mb-2 text-sm font-medium text-[#0D0D12]", labelClassName)}
          >
            {label}
          </label>
        )}
        <div className={cn("relative flex w-full")}>
          {hasLeftIcon && (
            <span className="absolute left-4 top-3 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            data-slot="textarea"
            rows={rows}
            className={cn(
              "w-full py-3 px-4 rounded-2xl bg-white border border-[#E5E7EB] text-gray-700",
              hasLeftIcon ? "pl-12" : "",
              hasRightIcon ? "pr-12" : "",
              "placeholder:text-[#9CA3AF] placeholder:text-base outline-none focus:border-[#C7C9D9] transition-colors",
              "shadow-none resize-y min-h-[96px]",
              "disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {hasRightIcon && (
            <span className="absolute right-4 top-3 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
