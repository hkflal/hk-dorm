"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
}

export const StickyBanner = ({ children, className }: StickyBannerProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Hide banner when scrolling down more than 100px
      if (currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "w-full transition-transform duration-300 ease-in-out z-40",
        isHidden ? "-translate-y-full" : "translate-y-0",
        className
      )}
      style={{
        position: 'relative'
      }}
    >
      <div className="flex items-center justify-center px-4 py-3 text-center">
        {children}
      </div>
    </div>
  );
};