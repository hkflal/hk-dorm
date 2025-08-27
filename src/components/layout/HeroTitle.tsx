"use client";

import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

export function HeroTitle() {
  const userTypes = ["外勞", "學生", "專才", "高才"];

  return (
    <div className="space-y-4">
      <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg text-center">
        外勞宿舍 - 來港
        <FlipWords 
          words={userTypes} 
          duration={2500}
          className="text-yellow-400 font-extrabold"
        />
        的首選
      </h1>
      <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md text-center">
        最為本地企業信賴的宿舍
      </p>
    </div>
  );
}