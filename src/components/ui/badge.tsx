import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-medium w-fit whitespace-nowrap gap-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-[#C4320A]/10 text-[#C4320A] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Custom status variants
        pending: "bg-[#F79009]/10 text-[#F79009] border-transparent",
        success: "bg-[#027A48]/10 text-[#027A48] border-emerald-100",
        failed: "bg-[#B42318]/10 text-[#B42318] border-transparent",
      },
      withDot: {
        true: "pl-2", // add left padding if dot is present
        false: "",
      },
      dotColor: {
        emerald: "",
        amber: "",
        red: "",
        none: "",
      }
    },
    defaultVariants: {
      variant: "default",
      withDot: false,
      dotColor: "none",
    },
  }
)

type BadgeStatus = "pending" | "success" | "failed"

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  status?: BadgeStatus
  withDot?: boolean
  dotColor?: "emerald" | "amber" | "red" | "none"
}

function getDotColorClass(variant: string | undefined, dotColor: string | undefined) {
  // If dotColor is set, use it, otherwise infer from variant
  switch (dotColor) {
    case "emerald":
      return "bg-emerald-700";
    case "amber":
      return "bg-amber-500";
    case "red":
      return "bg-red-800";
    default:
      // fallback to variant
      if (variant === "success") return "bg-[#027A48]";
      if (variant === "pending") return "bg-[#F79009]";
      if (variant === "destructive") return "bg-[#C4320A]";
      if (variant === "failed") return "bg-[#B42318]";
      return "bg-gray-400";
  }
}

function Badge({
  className,
  variant,
  asChild = false,
  status,
  withDot = false,
  dotColor = "none",
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  // If status is provided, override variant
  const badgeVariant = status
    ? status === "failed"
      ? "failed"
      : status
    : variant

  // If withDot is true, render a colored dot before children
  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: badgeVariant, withDot, dotColor }),
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn(
            "inline-block w-[6px] h-[6px] rounded-full",
            getDotColorClass(badgeVariant as string, dotColor !== "none" ? dotColor : undefined)
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
