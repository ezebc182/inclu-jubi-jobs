import type * as React from "react";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

import {
  Dialog as RadixDialog,
  DialogTrigger,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogDescription as RadixDialogDescription,
  DialogClose as RadixDialogClose,
} from "@radix-ui/react-dialog";

const dialogVariants = cva(
  "bg-background text-foreground shadow-lg rounded-lg w-full max-w-md",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Dialog = RadixDialog;

const DialogContent = forwardRef<
  React.ElementRef<typeof RadixDialogContent>,
  React.ComponentPropsWithoutRef<typeof RadixDialogContent>
>(({ className, children, ...props }, ref) => (
  <RadixDialogContent
    ref={ref}
    className={cn(dialogVariants(), className)}
    {...props}
  >
    {children}
  </RadixDialogContent>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("justify-end gap-2 p-6 sm:flex", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  React.ElementRef<typeof RadixDialogTitle>,
  React.ComponentPropsWithoutRef<typeof RadixDialogTitle>
>(({ className, ...props }, ref) => (
  <RadixDialogTitle
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  React.ElementRef<typeof RadixDialogDescription>,
  React.ComponentPropsWithoutRef<typeof RadixDialogDescription>
>(({ className, ...props }, ref) => (
  <RadixDialogDescription
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogClose = forwardRef<
  React.ElementRef<typeof RadixDialogClose>,
  React.ComponentPropsWithoutRef<typeof RadixDialogClose>
>(({ className, ...props }, ref) => (
  <RadixDialogClose
    ref={ref}
    className={cn(
      "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none",
      className
    )}
    {...props}
  />
));
DialogClose.displayName = "DialogClose";

const DialogTabsList = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ className, ...props }, ref) => (
  <Slot
    ref={ref}
    className={cn(
      "text-foreground inline-flex items-center justify-center rounded-md p-1",
      className
    )}
    {...props}
  />
));
DialogTabsList.displayName = "DialogTabsList";

const DialogTabsTrigger = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ className, ...props }, ref) => (
  <Slot
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-secondary data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
DialogTabsTrigger.displayName = "DialogTabsTrigger";

const DialogTabsContent = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ className, ...props }, ref) => (
  <Slot
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
DialogTabsContent.displayName = "DialogTabsContent";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTabsList,
  DialogTabsTrigger,
  DialogTabsContent,
};
