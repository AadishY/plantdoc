
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-all duration-200",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white hover:shadow-lg hover:shadow-plantDoc-primary/20 active:scale-95 transition-all duration-200",
        glass: "glass-button active:scale-95 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6",
      },
      roundedness: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      roundedness: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, roundedness, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, roundedness, className }))}
        ref={ref}
        {...props}
        onClick={(e) => {
          // Create ripple effect
          const button = e.currentTarget;
          const circle = document.createElement('span');
          const diameter = Math.max(button.clientWidth, button.clientHeight);
          const radius = diameter / 2;

          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.clientX - (button.getBoundingClientRect().left + radius)}px`;
          circle.style.top = `${e.clientY - (button.getBoundingClientRect().top + radius)}px`;
          circle.classList.add('ripple-effect');

          const ripple = button.querySelector('.ripple-effect');
          if (ripple) {
            ripple.remove();
          }

          button.appendChild(circle);
          
          // Call the original onClick if it exists
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      >
        {props.children}
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit"></span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
