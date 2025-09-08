"use client";

import { NewLocationCheckScreen } from "@/components/NewLocationCheckScreen";

export default function ConfirmLocation() {
  const character = {
    name: "もちもちうさぎ",
    type: "sakura-san",
  };

  const handleBack = () => {
    // 戻るボタンの処理
    console.log("戻るボタンが押されました");
  };

  const handleStartBathing = () => {
    // 入浴開始ボタンの処理
    console.log("入浴開始ボタンが押されました");
  };

  return (
    <NewLocationCheckScreen
      setOnsen={() => {}}
      character={character}
      onBack={handleBack}
      onStartBathing={handleStartBathing}
    />
  );
}
