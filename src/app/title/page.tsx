"use client";

import { TitleScreen } from "@/components/TitleScreen";

export default function Title() {
  const character = {
    name: "温泉ちゃん",
    type: "onsen-chan",
    level: 5,
    exp: 100,
    maxExp: 200,
    happiness: 80,
    stamina: 60,
    onsenCount: 3,
  };

  const handleStart = () => {
    console.log("タイトル画面クリック → ゲーム開始！");
  };

  const handleSettings = () => {
    console.log("設定ボタンクリック → 設定画面へ遷移！");
  };

  return (
    <TitleScreen
      onStart={handleStart}       
      onSettings={handleSettings} 
    />
  );
}
