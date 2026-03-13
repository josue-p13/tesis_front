import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold leading-none border",
  {
    variants: {
      variant: {
        default:     "bg-primary/15 text-primary border-primary/30",
        secondary:   "bg-surface-2 text-foreground border-border",
        outline:     "bg-transparent text-muted border-border",
        success:     "bg-success/15 text-success border-success/30",
        warning:     "bg-warning/15 text-warning border-warning/30",
        danger:      "bg-danger/15 text-danger border-danger/30",
        info:        "bg-info/15 text-info border-info/30",
        muted:       "bg-surface-2 text-muted border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
