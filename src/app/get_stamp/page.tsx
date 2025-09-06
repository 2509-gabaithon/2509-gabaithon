"use client";

import { StampAcquisitionScreen } from "@/components/StampAcquisitionScreen";
import stampImage from "@/assets/23d72f267674d7a86e5a4d3966ba367d52634bd9.png";

export default function GetStamp() {
  const handleComplete = () => {
    console.log("スタンプ獲得完了");
  };

  const acquiredStamp = { name: "温泉スタンプ", icon: stampImage.src };

  return (
    <StampAcquisitionScreen
      onComplete={handleComplete}
      acquiredStamp={acquiredStamp}
    />
  );
}
