"use client";

import React from "react";
import { StickyBanner } from "@/components/ui/sticky-banner";
import Link from "next/link";

export function PromotionBanner() {
  // Get current month in Chinese
  const getCurrentMonthInChinese = () => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
    const chineseMonths = [
      '一', '二', '三', '四', '五', '六',
      '七', '八', '九', '十', '十一', '十二'
    ];
    return chineseMonths[currentMonth - 1];
  };

  const currentMonth = getCurrentMonthInChinese();

  return (
    <StickyBanner className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-600">
      <p className="mx-0 max-w-[95%] text-red-600 drop-shadow-sm font-medium text-sm md:text-base">
        🎉 {currentMonth}月優惠，雇主直租港九勞工宿舍床位港幣$2,200 起！{" "}
        <Link href="/zh-hk/search" className="transition duration-200 hover:underline font-semibold ml-2 text-red-700 hover:text-red-800">
          立即查看 →
        </Link>
      </p>
    </StickyBanner>
  );
}