"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
}

export const StickyBanner = ({ children, className }: StickyBannerProps) => {
  return (
    <div
      role="region"
      aria-label="Promotion"
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-10 w-full shadow-[0_1px_0_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <div className="flex h-full items-center justify-center overflow-hidden px-3 text-center">
        {children}
      </div>
    </div>
  );
};
