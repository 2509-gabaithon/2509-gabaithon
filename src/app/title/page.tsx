"use client";

import { TitleScreen } from "@/components/TitleScreen";
import { playSound } from "@/utils/playSound";

export default function Title() {

  const handleStart = () => {
    playSound("clickSound.mp3");
    console.log("タイトル画面クリック → ゲーム開始！");
  };

  const handleSettings = () => {
    playSound("clickSound.mp3");
    console.log("設定ボタンクリック → 設定画面へ遷移！");
  };

  return (
    <TitleScreen
      onStart={handleStart}       
      onSettings={handleSettings} 
    />
  );
}
