import type React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex w-full max-w-full flex-col gap-4", className)}>
      {children}
    </div>
  );
}
