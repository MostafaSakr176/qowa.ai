'use client'
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { ComponentProps, forwardRef, ReactNode, useState } from "react";

interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label?: ReactNode;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon, iconPosition = "left", label, labelClassName, id, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determine if this is a password input
    const isPassword = type === "password";
    // If password and showPassword, use "text", else use the original type
    const inputType = isPassword && showPassword ? "text" : type;

    // If password, always show the eye icon on the right
    const shouldShowEye = isPassword;

    // Allow left icon for password type as well
    const hasLeftIcon = icon && iconPosition === "left";
    // Right icon is shown if icon is on right and not password, or always for password (eye)
    const hasRightIcon = (icon && iconPosition === "right" && !isPassword) || shouldShowEye;

    // Generate a fallback id if not provided and label exists
    const inputId = id || (label ? `input-${Math.random().toString(36).substr(2, 9)}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block mb-2 text-sm font-medium text-[#0D0D12]",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center w-full",
          )}
        >
          {/* Show left icon if provided, even for password */}
          {icon && iconPosition === "left" && (
            <span
              className={cn(
                "absolute left-4 flex items-center text-muted-foreground pointer-events-none"
              )}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            data-slot="input"
            className={cn(
              "w-full py-2 px-4 rounded-full border border-[#E5E7EB] text-gray-700",
              hasLeftIcon ? "pl-12 " : "",
              hasRightIcon ? "pr-12" : "",
              "placeholder:text-[#9CA3AF] placeholder:text-base outline-none focus:border-[#C7C9D9] transition-colors",
              "shadow-none",
              "disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60",
              className
            )}
            {...props}
          />
          {/* Show right icon only if not password and iconPosition is right */}
          {icon && iconPosition === "right" && !isPassword && (
            <span
              className={cn(
                "absolute right-4 flex items-center text-muted-foreground pointer-events-none"
              )}
            >
              {icon}
            </span>
          )}
          {/* Show eye icon for password */}
          {shouldShowEye && (
            <button
              type="button"
              tabIndex={-1}
              className={cn(
                "absolute right-4 flex items-center text-muted-foreground focus:outline-none"
              )}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
