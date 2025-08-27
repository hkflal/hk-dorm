"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PropertyFeaturesCarousel() {
  const cards = propertyFeatures.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 font-sans">
        外勞宿舍優勢
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const PropertyFeatureContent = ({ title, features }: { title: string; features: string[] }) => {
  return (
    <>
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            {title}
          </span>
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-neutral-600 dark:text-neutral-400">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const propertyFeatures = [
  {
    category: "安全保障",
    title: "24小時安全監控",
    src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="我們提供全天候的安全保障服務，讓您安心居住。"
      features={[
        "24小時閉路電視監控",
        "門禁卡系統控制",
        "專業保安人員駐守",
        "緊急警報系統",
        "訪客登記管理",
        "安全照明設施"
      ]}
    />,
  },
  {
    category: "便利設施",
    title: "完善生活配套",
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="為您提供舒適便利的生活環境和完善的設施配套。"
      features={[
        "高速WiFi覆蓋",
        "洗衣烘乾設備",
        "公共廚房設施",
        "休息娛樂區域",
        "24小時熱水供應",
        "空調溫控系統"
      ]}
    />,
  },
  {
    category: "交通便利",
    title: "鄰近港鐵站點",
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="所有房源均位於港鐵站附近，出行便利快捷。"
      features={[
        "步行5-10分鐘到港鐵站",
        "多條巴士路線覆蓋",
        "24小時公共交通",
        "連接各大商業區",
        "機場快線直達",
        "的士站就近設置"
      ]}
    />,
  },
  {
    category: "社區環境",
    title: "優質居住環境",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="精心挑選的房源位於優質社區，環境安全舒適。"
      features={[
        "安全社區環境",
        "購物商場就近",
        "餐廳食肆豐富",
        "醫療服務便利",
        "公園綠地環繞",
        "文化娛樂設施"
      ]}
    />,
  },
  {
    category: "服務支援",
    title: "專業客戶服務",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="我們提供專業的客戶服務，隨時為您解決住宿相關問題。"
      features={[
        "24小時客服熱線",
        "多語言服務支援",
        "線上即時客服",
        "入住指導服務",
        "維修保養服務",
        "租約管理協助"
      ]}
    />,
  },
  {
    category: "經濟實惠",
    title: "合理租金價格",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <PropertyFeatureContent 
      title="提供市場上最具競爭力的租金價格，讓您輕鬆負擔。"
      features={[
        "透明合理定價",
        "無隱藏額外費用",
        "靈活租期選擇",
        "押金保障制度",
        "多種付款方式",
        "租金優惠活動"
      ]}
    />,
  },
];