"use client";

import { TitleScreen } from "@/components/TitleScreen";

export default function Title() {
   const clickSound = new Audio("/clickSound.mp3");

  const handleStart = () => {
    clickSound.play();
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
