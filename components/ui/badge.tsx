import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        custom:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground p-2",
        category:
          "bg-green-700/10 text-green-600 p-1.5 rounded-lg border border-green-600",
        duration:
          "bg-yellow-700/10 text-yellow-600 p-1.5 rounded-lg border border-yellow-600",

        //level
        Beginner: "bg-green-600 text-white p-1.5 rounded-md border-none shadow-sm",
        Intermediate: "bg-yellow-600 text-white p-1.5 rounded-md border-none shadow-sm",
        Advanced: "bg-blue-600 text-white p-1.5 rounded-md border-none shadow-sm",
        
        //status
        Draft: "bg-accent/50 text-white text-xs p-1.5 rounded-md shadow-sm border border-primary border-dashed",
        Published: "bg-green-700 text-white text-xs p-1.5 rounded-md shadow-sm border-none",
        Archived: "bg-yellow-600 text-white text-xs p-1.5 rounded-md shadow-sm border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
