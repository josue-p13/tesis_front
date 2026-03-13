import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-fg hover:opacity-90 shadow-sm shadow-primary/20",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-primary/50",
        ghost:
          "text-foreground hover:bg-surface-2",
        danger:
          "bg-danger text-danger-fg hover:opacity-90",
        secondary:
          "bg-surface-2 text-foreground border border-border hover:border-primary/50",
      },
      size: {
        sm:      "h-7 px-3 text-xs rounded",
        default: "h-9 px-4 py-2",
        lg:      "h-10 px-6 text-sm",
        icon:    "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
